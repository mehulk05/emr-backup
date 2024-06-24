/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/no-output-on-prefix */
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AudioVideoObserver,
  ClientMetricReport,
  ClientVideoStreamReceivingReport,
  ConnectionHealthData,
  ConsoleLogger,
  DefaultActiveSpeakerPolicy,
  DefaultAudioMixController,
  DefaultDeviceController,
  DefaultMeetingSession,
  DefaultVideoTransformDevice,
  Device,
  LogLevel,
  MeetingSessionConfiguration,
  MeetingSessionStatus,
  MeetingSessionStatusCode,
  MeetingSessionVideoAvailability,
  TimeoutScheduler,
  VideoTileState
} from 'amazon-chime-sdk-js';

@Component({
  selector: 'app-aws-chime-online-meeting',
  templateUrl: './aws-chime-online-meeting.component.html',
  styleUrls: ['./aws-chime-online-meeting.component.css']
})
export class AwsChimeOnlineMeetingComponent
  implements OnInit, AudioVideoObserver, OnDestroy {
  @Input() config: any = {};
  @Output() onLeaveMeeting = new EventEmitter<any>();
  @Output() onEndMeeting = new EventEmitter<any>();

  @ViewChild('videoPreview') videoPreviewRef: ElementRef;
  @ViewChild('audioPreview') audioPreviewRef: ElementRef;
  @ViewChild('meetingAudio') meetingAudioRef: ElementRef;

  meetingSession: any = null;
  audioInputDevices: any = [];
  audioOutputDevices: any = [];
  videoInputDevices: any = [];
  deviceForm: FormGroup;
  audioPreviewPrecent = 0;
  private selectedVideoInput: string = '';
  meetingJoined = false;

  tileOrganizer: DemoTileOrganizer = new DemoTileOrganizer();
  canStartLocalVideo: boolean = true;
  // eslint-disable-next-line
  roster: any = {};
  tileIndexToTileId: { [id: number]: number } = {} as any;
  tileIdToTileIndex: { [id: number]: number } = {} as any;

  showActiveSpeakerScores = false;
  activeSpeakerLayout = false;

  // feature flags
  enableWebAudio = false;
  enableUnifiedPlanForChromiumBasedBrowsers = true;

  constructor(public formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.deviceForm = this.formBuilder.group({
      microphone: ['', [Validators.required]],
      speaker: ['', []],
      camera: ['', [Validators.required]],
      videoQuality: ['360p', []]
    });

    this.startSession(this.config);
  }

  log(str: string): void {
    console.log('[AWS CHIME]', str);
  }

  toCapatalizeCase(value: any) {
    return value.charAt(0).toUpperCase() + value.substring(1);
  }

  objectKeysToLowerCase(origObj: any) {
    return Object.keys(origObj).reduce((newObj: any, key: any) => {
      const val = origObj[key];
      const newVal =
        typeof val === 'object' ? this.objectKeysToLowerCase(val) : val;
      newObj[this.toCapatalizeCase(key)] = newVal;
      return newObj;
    }, {});
  }

  startSession(data: any) {
    //  this.log(
    //   'Meeting created and attendee created. Response:' + JSON.stringify(data)
    // );

    let meetingResponse = JSON.parse(data.meetingResponse);
    let attendeeResponse = JSON.parse(data.attendeeResponse);

    // Note: make keys as required because the java side give different keys.
    meetingResponse = this.objectKeysToLowerCase(meetingResponse);
    attendeeResponse = this.objectKeysToLowerCase(attendeeResponse);

    const logger = new ConsoleLogger('MyLogger', LogLevel.ERROR);

    const configuration = new MeetingSessionConfiguration(
      meetingResponse,
      attendeeResponse
    );
    (configuration as any).enableWebAudio = this.enableWebAudio;
    configuration.enableUnifiedPlanForChromiumBasedBrowsers =
      this.enableUnifiedPlanForChromiumBasedBrowsers;

    const deviceController = new DefaultDeviceController(logger);
    // In the usage examples below, you will use this meetingSession object.
    this.meetingSession = new DefaultMeetingSession(
      configuration,
      logger,
      deviceController
    );
    console.log(this.meetingSession, this.meetingSession.audioVideo);
    // this.log('Meeting session =>' + this.meetingSession);

    this.meetingSession.audioVideo
      .listAudioInputDevices()
      .then((response: any) => {
        console.log('audo', response);
        // this.log('Audio Input Devices=>' + response);
        this.audioInputDevices = response;
        if (response.length > 0) {
          this.deviceForm.patchValue({ microphone: response[0].deviceId });
          this.openAudioInputFromSelection();
        }
      });

    this.meetingSession.audioVideo
      .listAudioOutputDevices()
      .then((response: any) => {
        // this.log('Audio Output Devices=>' + response);
        this.audioOutputDevices = response;
        if (response.length > 0) {
          this.deviceForm.patchValue({ speaker: response[0].deviceId });
          //this.openAudioOutputFromSelection();
        }
      });

    this.meetingSession.audioVideo
      .listVideoInputDevices()
      .then((response: any) => {
        // this.log('Video Devices=>' + response);
        this.videoInputDevices = response;
        if (response.length > 0) {
          this.deviceForm.patchValue({ camera: response[0].deviceId });
          this.openVideoInputFromSelection(response[0].deviceId, true);
        }
      });

    this.setupSubscribeToAttendeeIdPresenceHandler();
    this.setupScreenViewing();
    this.meetingSession.audioVideo.addObserver(this);
  }

  microphoneChange = ($event: any) => {
    this.openAudioInputFromSelection();
  };

  speakerChange = ($event: any) => {
    this.openAudioOutputFromSelection();
  };

  cameraChange = ($event: any) => {
    const formData = this.deviceForm.value;
    if (formData.camera != '') {
      this.openVideoInputFromSelection(formData.camera, true);
    }
  };

  async videoInputQualityChange($event: any): Promise<void> {
    const formData = this.deviceForm.value;
    switch (formData.videoQuality) {
      case '360p':
        this.meetingSession.audioVideo.chooseVideoInputQuality(
          640,
          360,
          15,
          600
        );
        break;
      case '540p':
        this.meetingSession.audioVideo.chooseVideoInputQuality(
          960,
          540,
          15,
          1400
        );
        break;
      case '720p':
        this.meetingSession.audioVideo.chooseVideoInputQuality(
          1280,
          720,
          15,
          1400
        );
        break;
    }
    try {
      await this.openVideoInputFromSelection(formData.videoQuality, true);
    } catch (err) {
      // this.log('no video input device selected');
    }
  }

  setAudioPreviewPercent(percent: number): void {
    this.audioPreviewPrecent = percent;
  }

  async openAudioInputFromSelection(): Promise<void> {
    const formData = this.deviceForm.value;
    // this.log('Selected Microphone=>' + formData.microphone);
    if (formData.microphone != '') {
      await this.meetingSession.audioVideo.chooseAudioInputDevice(
        formData.microphone
      );
    }

    this.startAudioPreview();
  }

  async openAudioOutputFromSelection(): Promise<void> {
    const formData = this.deviceForm.value;
    // this.log('Selected speaker=>' + formData.microphone);
    if (formData.speaker != '') {
      await this.meetingSession.audioVideo.chooseAudioInputDevice(
        formData.speaker
      );
    }

    const audioMix = this.meetingAudioRef.nativeElement;
    await this.meetingSession.audioVideo.bindAudioElement(audioMix);
  }

  async openVideoInputFromSelection(
    selection: string | null,
    showPreview: boolean
  ): Promise<void> {
    if (selection) {
      this.selectedVideoInput = selection;
    }
    // this.log(`Switching to: ${this.selectedVideoInput}`);

    const device = this.videoInputSelectionToDevice(this.selectedVideoInput);
    if (device === null) {
      if (showPreview) {
        const videoPreview = this.videoPreviewRef
          .nativeElement as HTMLVideoElement;
        this.meetingSession.audioVideo.stopVideoPreviewForVideoInput(
          videoPreview
        );
      }
      this.meetingSession.audioVideo.stopLocalVideoTile();
      //this.toggleButton('button-camera', 'off');
      // choose video input null is redundant since we expect stopLocalVideoTile to clean up
      await this.meetingSession.audioVideo.chooseVideoInputDevice(device);
      throw new Error('no video device selected');
    }

    await this.meetingSession.audioVideo.chooseVideoInputDevice(device);

    if (showPreview) {
      const videoPreview = this.videoPreviewRef
        .nativeElement as HTMLVideoElement;
      this.meetingSession.audioVideo.startVideoPreviewForVideoInput(
        videoPreview
      );
    }
  }

  private videoInputSelectionToDevice(value: string): Device {
    if (value === 'Blue') {
      return DefaultDeviceController.synthesizeVideoDevice('blue');
    } else if (value === 'SMPTE Color Bars') {
      return DefaultDeviceController.synthesizeVideoDevice('smpte');
    } else if (value === 'None') {
      return null;
    }
    return value;
  }

  startAudioPreview(): void {
    this.setAudioPreviewPercent(0);

    const analyserNode =
      this.meetingSession.audioVideo.createAnalyserNodeForAudioInput();
    if (!analyserNode) {
      return;
    }

    if (!analyserNode.getByteTimeDomainData) {
      this.audioPreviewRef.nativeElement.parentElement.style.visibility =
        'hidden';
      return;
    }

    const data = new Uint8Array(analyserNode.fftSize);
    const frameIndex = 0;
    requestAnimationFrame(() => {
      this.analyserNodeCallback(frameIndex, analyserNode, data);
    });
  }

  analyserNodeCallback = (frameIndex: any, analyserNode: any, data: any) => {
    if (frameIndex === 0) {
      analyserNode.getByteTimeDomainData(data);
      const lowest = 0.01;
      let max = lowest;
      for (const f of data) {
        max = Math.max(max, (f - 128) / 128);
      }
      const normalized = (Math.log(lowest) - Math.log(max)) / Math.log(lowest);
      const percent = Math.min(Math.max(normalized * 100, 0), 100);
      this.setAudioPreviewPercent(percent);
    }
    frameIndex = (frameIndex + 1) % 2;
    requestAnimationFrame(() => {
      this.analyserNodeCallback(frameIndex, analyserNode, data);
    });
  };

  onTestSoundClick = ($event: any) => {
    const formData = this.deviceForm.value;
    new TestSound(formData.speaker);
  };

  async submitForm() {
    await this.join();

    // stop video preview
    const videoPreview = this.videoPreviewRef.nativeElement as HTMLVideoElement;
    this.meetingSession.audioVideo.stopVideoPreviewForVideoInput(videoPreview);
    this.meetingSession.audioVideo.chooseVideoInputDevice(null);

    this.meetingJoined = true;
  }

  async join(): Promise<void> {
    window.addEventListener(
      'unhandledrejection',
      (event: PromiseRejectionEvent) => {
        // this.log(event.reason);
      }
    );
    await this.openAudioInputFromSelection();
    await this.openAudioOutputFromSelection();
    this.meetingSession.audioVideo.start();
    console.log(this.meetingSession);
    const logger = new ConsoleLogger('MyLogger', LogLevel.ERROR);

    const stages: any = []; // constructs some custom processor
    const transformDevice = new DefaultVideoTransformDevice(
      logger,
      {} as Device, // Not needed when using transform directly
      stages
    );
    await transformDevice.transformStream();
    // const logger = new ConsoleLogger('MyLogger', LogLevel.ERROR);

    // const stages: any = []; // constructs some custom processor
    // const transformDevice = new DefaultVideoTransformDevice(
    //   logger,
    //   undefined, // Not needed when using transform directly
    //   stages
    // );
    // await this.meetingSession.audioVideo.startContentShare(
    //   await transformDevice.transformStream()
    // );
  }

  async leave(): Promise<void> {
    await this.meetingSession.audioVideo.stop();

    // TODO: you have leave the meeting, you may go to same page and click join again.
    this.onLeaveMeeting.emit({ leaved: true });
  }

  async endMeeting(): Promise<any> {
    await this.leave();

    // end meeting on server, then show end meeting message.
    this.onEndMeeting.emit({ ended: true });
  }

  isMicrophoneMute = false;

  toggleMicrophone = ($event: any) => {
    if (this.isMicrophoneMute) {
      this.meetingSession.audioVideo.realtimeUnmuteLocalAudio();
    } else {
      this.meetingSession.audioVideo.realtimeMuteLocalAudio();
    }

    this.isMicrophoneMute = !this.isMicrophoneMute;
  };

  isCameraOn = false;
  async toggleCamera($event: any): Promise<void> {
    if (!this.isCameraOn) {
      try {
        const formData = this.deviceForm.value;
        let camera: string = formData.camera;
        if (camera === '') {
          camera =
            this.videoInputDevices.length > 0
              ? this.videoInputDevices[0].deviceId
              : '';
        }
        await this.openVideoInputFromSelection(camera, false);
        this.meetingSession.audioVideo.startLocalVideoTile();
      } catch (err) {
        // this.log('no video input device selected');
      }
    } else {
      this.meetingSession.audioVideo.stopLocalVideoTile();
      // this.log('Hiding the tile as camera off.');
      this.hideTile(16);
    }

    this.isCameraOn = !this.isCameraOn;
  }

  isScreenShareOn = false;
  async toggleScreenShare($event: any): Promise<void> {
    if (this.isScreenShareOn) {
      this.meetingSession.screenShare
        .stop()
        .catch((error: any) => {
          // this.log(error);
        })
        .finally(() => {
          this.isScreenShareOn = false;
        });
    } else {
      const self = this;
      const observer: any = {
        didStopScreenSharing(): void {
          self.isScreenShareOn = false;
        }
      };
      this.meetingSession.screenShare.registerObserver(observer);
      this.meetingSession.screenShare.start().then(() => {
        this.isScreenShareOn = true;
      });
    }
  }

  isScreenSharePause = false;
  async pauseScreenShare($event: any): Promise<void> {
    if (!this.isScreenSharePause) {
      this.meetingSession.screenShare.unpause().then(() => {
        this.isScreenSharePause = !this.isScreenSharePause;
      });
    } else {
      const self = this;
      const observer: any = {
        didUnpauseScreenSharing(): void {
          self.isScreenSharePause = true;
        }
      };
      this.meetingSession.screenShare.registerObserver(observer);
      this.meetingSession.screenShare
        .pause()
        .then(() => {
          this.isScreenSharePause = false;
        })
        .catch((error: any) => {
          // this.log(error);
        });
    }
  }

  isSpeakerOn = true;
  async toggleSpaker($event: any): Promise<void> {
    if (!this.isSpeakerOn) {
      const audio = this.meetingAudioRef.nativeElement as HTMLAudioElement;
      this.meetingSession.audioVideo.bindAudioElement(audio);
    } else {
      this.meetingSession.audioVideo.unbindAudioElement();
    }

    this.isSpeakerOn = !this.isSpeakerOn;
  }

  setupSubscribeToAttendeeIdPresenceHandler(): void {
    const handler = (attendeeId: string, present: boolean): void => {
      // this.log(`${attendeeId} present = ${present}`);
      if (!present) {
        delete this.roster[attendeeId];
        return;
      }
      this.meetingSession.audioVideo.realtimeSubscribeToVolumeIndicator(
        attendeeId,
        async (
          attendeeId: string,
          volume: number | null,
          muted: boolean | null,
          signalStrength: number | null,
          externalUserId: string
        ) => {
          if (!this.roster[attendeeId]) {
            this.roster[attendeeId] = { name: '' };
          }
          if (volume !== null) {
            this.roster[attendeeId].volume = Math.round(volume * 100);
          }
          if (muted !== null) {
            this.roster[attendeeId].muted = muted;
          }
          if (signalStrength !== null) {
            this.roster[attendeeId].signalStrength = Math.round(
              signalStrength * 100
            );
          }
          this.roster[attendeeId].name = externalUserId.split('#')[1];
          // this.log("External user id" +  externalUserId);
        }
      );
    };

    this.meetingSession.audioVideo.realtimeSubscribeToAttendeeIdPresence(
      handler
    );
    const activeSpeakerHandler = (attendeeIds: string[]): void => {
      for (const attendeeId in this.roster) {
        this.roster[attendeeId].active = false;
      }
      for (const attendeeId of attendeeIds) {
        if (this.roster[attendeeId]) {
          this.roster[attendeeId].active = true;
          break; // only show the most active speaker
        }
      }
      //this.layoutVideoTiles();
    };

    this.meetingSession.audioVideo.subscribeToActiveSpeakerDetector(
      new DefaultActiveSpeakerPolicy(),
      activeSpeakerHandler,
      (scores: { [attendeeId: string]: number }) => {
        for (const attendeeId in scores) {
          if (this.roster[attendeeId]) {
            this.roster[attendeeId].score = scores[attendeeId];
          }
        }
      },
      this.showActiveSpeakerScores ? 100 : 0
    );
  }

  private setupScreenViewing(): void {
    const self = this;
    this.meetingSession.audioVideo.addObserver({
      streamDidStart(screenMessageDetail: any): void {
        const rosterEntry = self.roster[screenMessageDetail.attendeeId];
        const element = document.getElementById('nameplate-17');
        if (element) {
          element.innerHTML = rosterEntry ? rosterEntry.name : '';
        }
      },
      streamDidStop(_screenMessageDetail: any): void {
        const element = document.getElementById('nameplate-17');
        if (element) {
          element.innerHTML = 'No one is sharing screen';
        }
      }
    });
  }

  /**
   * Called when the session is connecting or reconnecting.
   */
  audioVideoDidStartConnecting(reconnecting: boolean): void {
    // this.log(`session connecting. reconnecting: ${reconnecting}`);
  }
  /**
   * Called when the session has started.
   */
  audioVideoDidStart(): void {
    // this.log('session started');
  }

  /**
   * Called when the session has stopped from a started state with the reason
   * provided in the status.
   */
  audioVideoDidStop(sessionStatus: MeetingSessionStatus): void {
    // this.log(`session stopped from ${JSON.stringify(sessionStatus)}`);
    if (
      sessionStatus.statusCode() === MeetingSessionStatusCode.AudioCallEnded
    ) {
      // this.log(`meeting ended`);
      this.endMeeting();
    } else {
      if (sessionStatus.statusCode() === MeetingSessionStatusCode.Left) {
        // other left
        this.leave();
      }
    }
  }

  /**
   * Called whenever a tile has been created or updated.
   */
  videoTileDidUpdate(tileState: VideoTileState): void {
    // this.log(`video tile updated: ${JSON.stringify(tileState, null, '  ')}`);

    if (!tileState.boundAttendeeId) {
      return;
    }
    const tileIndex = tileState.localTile
      ? 16
      : this.tileOrganizer.acquireTileIndex(tileState.tileId ?? 0);
    const tileElement = document.getElementById(
      `tile-${tileIndex}`
    ) as HTMLDivElement;
    const videoElement = document.getElementById(
      `video-${tileIndex}`
    ) as HTMLVideoElement;
    const nameplateElement = document.getElementById(
      `nameplate-${tileIndex}`
    ) as HTMLDivElement;

    const pauseButtonElement = document.getElementById(
      `video-pause-${tileIndex}`
    ) as HTMLButtonElement;
    const resumeButtonElement = document.getElementById(
      `video-resume-${tileIndex}`
    ) as HTMLButtonElement;

    pauseButtonElement.addEventListener('click', () => {
      if (!tileState.paused) {
        this.meetingSession.audioVideo.pauseVideoTile(tileState.tileId);
      }
    });

    resumeButtonElement.addEventListener('click', () => {
      if (tileState.paused) {
        this.meetingSession.audioVideo.unpauseVideoTile(tileState.tileId);
      }
    });

    // this.log(`binding video tile ${tileState.tileId} to ${videoElement.id}`);

    if (videoElement && tileState.tileId !== null) {
      this.meetingSession.audioVideo.bindVideoElement(
        tileState.tileId,
        videoElement
      );
      this.tileIndexToTileId[tileIndex] = tileState.tileId;
      this.tileIdToTileIndex[tileState.tileId] = tileIndex;
    }


    if (nameplateElement) {
      const rosterName = tileState.boundExternalUserId
        ? tileState.boundExternalUserId.split('#')[1]
        : 'Unknown User';
      if (nameplateElement.innerHTML !== rosterName) {
        nameplateElement.innerHTML = rosterName;
      }
    }

    if (tileState.active) {
      tileElement.style.display = 'block';
    } else {
      //tileElement.style.display = 'none';
    }

    this.layoutVideoTiles();
  }

  /**
   * Called whenever a tile has been removed.
   */
  videoTileWasRemoved(tileId: number): void {
    // this.log(`video tile removed: ${tileId}`);
    //this.tileOrganizer.releaseTileIndex(tileId);
    this.hideTile(this.tileOrganizer.releaseTileIndex(tileId));
  }

  /**
   * Called when video availability has changed. This information can be used to decide whether to
   * switch the connection type to video and whether or not to offer the option to start the local
   * video tile.
   */
  videoAvailabilityDidChange(
    availability: MeetingSessionVideoAvailability
  ): void {
    this.canStartLocalVideo = availability.canStartLocalVideo;
    // this.log(
    //   `video availability changed: canStartLocalVideo  ${availability.canStartLocalVideo}`
    // );
  }

  hideTile(tileIndex: number): void {
    // this.log('hiding tile ' + tileIndex);
    const tileElement = document.getElementById(
      `tile-${tileIndex}`
    ) as HTMLDivElement;
    tileElement.style.display = 'none';
    this.layoutVideoTiles();
  }

  tileIdForAttendeeId(attendeeId: string): number | null {
    for (const tile of this.meetingSession.audioVideo.getAllVideoTiles()) {
      const state = tile.state();
      if (state.boundAttendeeId === attendeeId) {
        return state.tileId;
      }
    }
    return null;
  }

  activeTileId(): number | null {
    for (const attendeeId in this.roster) {
      if (this.roster[attendeeId].active) {
        return this.tileIdForAttendeeId(attendeeId);
      }
    }
    return null;
  }

  layoutVideoTiles(): void {
    if (!this.meetingSession) {
      return;
    }
    const selfAttendeeId =
      this.meetingSession.configuration.credentials.attendeeId;
    const selfTileId = this.tileIdForAttendeeId(selfAttendeeId) || 0;
    const visibleTileIndices = this.visibleTileIndices();
    let activeTileId = this.activeTileId() || 0;
    const selfIsVisible = visibleTileIndices.includes(
      this.tileIdToTileIndex[selfTileId]
    );
    if (visibleTileIndices.length === 2 && selfIsVisible) {
      activeTileId =
        this.tileIndexToTileId[
        visibleTileIndices[0] === selfTileId
          ? visibleTileIndices[1]
          : visibleTileIndices[0]
        ];
    }
    const hasVisibleActiveSpeaker = visibleTileIndices.includes(
      this.tileIdToTileIndex[activeTileId]
    );
    if (this.activeSpeakerLayout && hasVisibleActiveSpeaker) {
      //this.layoutVideoTilesActiveSpeaker(visibleTileIndices, activeTileId);
    } else {
      //this.layoutVideoTilesGrid(visibleTileIndices);
    }
  }

  visibleTileIndices(): number[] {
    let tiles: number[] = [];
    const screenViewTileIndex = 17;
    for (let tileIndex = 0; tileIndex <= screenViewTileIndex; tileIndex++) {
      const tileElement = document.getElementById(
        `tile-${tileIndex}`
      ) as HTMLDivElement;
      if (tileElement.style.display === 'block') {
        if (tileIndex === screenViewTileIndex) {
          // Hide videos when viewing screen
          for (const tile of tiles) {
            const tileToSuppress = document.getElementById(
              `tile-${tile}`
            ) as HTMLDivElement;
            tileToSuppress.style.visibility = 'hidden';
          }
          tiles = [screenViewTileIndex];
        } else {
          tiles.push(tileIndex);
        }
      }
    }
    return tiles;
  }

  /**
   * Called when metric of video outbound traffic is received.
   */
  videoSendHealthDidChange(
    bitrateKbps: number,
    packetsPerSecond: number
  ): void { }
  /**
   * Called when available video sending bandwidth changed.
   */
  videoSendBandwidthDidChange(
    newBandwidthKbps: number,
    oldBandwidthKbps: number
  ): void { }
  /**
   * Called when available video receiving bandwidth changed to trigger video subscription if needed.
   */
  videoReceiveBandwidthDidChange(
    newBandwidthKbps: number,
    oldBandwidthKbps: number
  ): void { }
  /**
   * Called when total downlink video bandwidth estimation is less than required video bitrates.
   */
  estimatedDownlinkBandwidthLessThanRequired(
    estimatedBandwidth: number,
    requiredBandwidth: number
  ): void { }
  /**
   * Called when one or more remote video streams do not meet expected average bitrate
   */
  videoNotReceivingEnoughData(
    receivingDataMap: ClientVideoStreamReceivingReport[]
  ): void { }
  /**
   * Called when the media stats are available.
   */
  metricsDidReceive(clientMetricReport: ClientMetricReport): void { }
  /**
   * Called when connection health has changed.
   */
  connectionHealthDidChange(connectionHealthData: ConnectionHealthData): void {
    // this.log('' + JSON.stringify(connectionHealthData));
  }
  /**
   * Called when the connection has been poor for a while.
   */
  connectionDidBecomePoor(): void {
    // this.log('connection is poor');
  }
  /**
   * Called when the connection has been poor while using video so that the observer
   * can prompt the user about turning off video.
   */
  connectionDidSuggestStopVideo(): void {
    // this.log('suggest turning the video off');
  }
  /**
   * Called when a user tries to start a video but by the time the backend processes the request,
   * video capacity has been reached and starting local video is not possible. This can be used to
   * trigger a message to the user about the situation.
   */
  videoSendDidBecomeUnavailable(): void {
    // this.log('sending video is not available');
  }

  ngOnDestroy(): void {
    console.log('on destroy');
    this.leave();
    this.config = null;
    let windowStream: any;
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        console.log(stream);
        windowStream = stream;
        windowStream.getTracks().forEach((track: any) => {
          console.log(track);
          track.stop();
        });
      })
      .catch((err) => {
        console.log(err);
      });
    setTimeout(() => {
      window.location.reload();
    }, 500);
    // later you can do below
    // stop both video and audio
  }
}

declare global {
  interface Window {
    localStream: any;
  }
}
class TestSound {
  constructor(
    sinkId: string | null,
    frequency: number = 440,
    durationSec: number = 1,
    rampSec: number = 0.1,
    maxGainValue: number = 0.1
  ) {
    // @ts-ignore
    const audioContext: AudioContext = new (window.AudioContext ||
      (window as any).window.webkitAudioContext)();
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0;
    const oscillatorNode = audioContext.createOscillator();
    oscillatorNode.frequency.value = frequency;
    oscillatorNode.connect(gainNode);
    const destinationStream = audioContext.createMediaStreamDestination();
    gainNode.connect(destinationStream);
    const currentTime = audioContext.currentTime;
    const startTime = currentTime + 0.1;
    gainNode.gain.linearRampToValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(maxGainValue, startTime + rampSec);
    gainNode.gain.linearRampToValueAtTime(
      maxGainValue,
      startTime + rampSec + durationSec
    );
    gainNode.gain.linearRampToValueAtTime(
      0,
      startTime + rampSec * 2 + durationSec
    );
    oscillatorNode.start();
    const audioMixController = new DefaultAudioMixController();
    // @ts-ignore
    audioMixController.bindAudioDevice({ deviceId: sinkId });
    audioMixController.bindAudioElement(new Audio());
    audioMixController.bindAudioStream(destinationStream.stream);
    new TimeoutScheduler((rampSec * 2 + durationSec + 1) * 1000).start(() => {
      audioContext.close();
    });
  }
}

class DemoTileOrganizer {
  private static MAX_TILES = 16;
  private tiles: { [id: number]: number } = {};
  public tileStates: { [id: number]: boolean } = {};

  acquireTileIndex(tileId: number): number {
    for (let index = 0; index < DemoTileOrganizer.MAX_TILES; index++) {
      if (this.tiles[index] === tileId) {
        return index;
      }
    }
    for (let index = 0; index < DemoTileOrganizer.MAX_TILES; index++) {
      if (!(index in this.tiles)) {
        this.tiles[index] = tileId;
        return index;
      }
    }
    throw new Error('no tiles are available');
  }

  releaseTileIndex(tileId: number): number {
    for (let index = 0; index < DemoTileOrganizer.MAX_TILES; index++) {
      if (this.tiles[index] === tileId) {
        delete this.tiles[index];
        return index;
      }
    }
    return DemoTileOrganizer.MAX_TILES;
  }
}
