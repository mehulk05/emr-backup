const Layouts = {
  container1: `<div  class="gjs-row" data-gjs-droppable=".gjs-cell" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":0,"bl":0,"br":0,"minDim":1}' data-gjs-name="Row">
        <div  class="gjs-cell" data-gjs-draggable=".gjs-row" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
    </div>
  <style>
      
  .gjs-row {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    flex-wrap: nowrap;
    padding: 10px;
  }

  @media only screen and (max-width: 480px) {
    .gjs-cell, .gjs-cell30, .gjs-cell70 {
        flex-wrap: wrap;
    }
  }
      
  .gjs-cell {
    min-height: 75px;
      flex-basis: 100%;
      display: flex;
      flex-direction : column;
  }
</style>`,

  container2: `<div  class="gjs-rowc" data-gjs-droppable=".gjs-cellc" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":0,"bl":0,"br":0,"minDim":1}' data-gjs-name="Row">
<div  class="gjs-cellc" data-gjs-draggable=".gjs-rowc" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
</div>
<style>
.gjs-rowc {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    flex-wrap: nowrap;
    padding: 10px;
  }

  @media only screen and (max-width: 480px) {
    .gjs-cellc, .gjs-cell30, .gjs-cell70 {
        flex-wrap: wrap;
    }
  }
      
  .gjs-cellc {
    min-height: 75px;
      display: flex;
      flex-direction : row;
      flex-basis: 100%;
  }
</style>`,

  // 2 parts
  container3: `<div  class="gjs-row3" data-gjs-droppable=".gjs-row3" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":0,"bl":0,"br":0,"minDim":1}' data-gjs-name="Row">
        <div  class="gjs-cell31" data-gjs-draggable=".gjs-cell31" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
        <div  class="gjs-cell32" data-gjs-draggable=".gjs-cell32" data-gjs-name="Cell"></div>
    </div>
<style>
    
.gjs-row3 {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    flex-wrap: nowrap;
    padding: 10px;
  }

  .gjs-cell31, .gjs-cell32 {
    min-height: 75px;
    flex-grow: 1;
    width:50%;

  }

  @media only screen and (max-width: 480px) {
    .gjs-row3 {
        flex-wrap: wrap;
    }
    .gjs-cell31, .gjs-cell32{
      width:100%;
    }
  }
      
</style>`,

  // 3 by 7
  container4: `<div  class="gjs-row4" data-gjs-droppable=".gjs-row4" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":0,"bl":0,"br":0,"minDim":1}' data-gjs-name="Row">
    <div  class="gjs-cell41" data-gjs-draggable=".gjs-cell41" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell" ></div>
    <div  class="gjs-cell42" data-gjs-draggable=".gjs-cell42" data-gjs-name="Cell" ></div>
</div>
<style>
   
.gjs-row4 {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    flex-wrap: nowrap;
    padding: 10px;
  }

        
  .gjs-cell41 {
    min-height: 75px;
      width : 33%;
  }

  .gjs-cell42 {
    min-height: 75px;
      width : 77%;
  }

  @media only screen and (max-width: 480px) {
    .gjs-row4 {
        flex-wrap: wrap;
    }
    .gjs-cell41, .gjs-cell42{
      width:100%;
    }
  }

</style>`,

  // 4 parts
  container5: `<div  class="gjs-row5" data-gjs-droppable=".gjs-row5" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":0,"bl":0,"br":0,"minDim":1}' data-gjs-name="Row">
<div  class="gjs-cell51" data-gjs-draggable=".gjs-cell51" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
<div  class="gjs-cell52" data-gjs-draggable=".gjs-cell52" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
<div  class="gjs-cell53" data-gjs-draggable=".gjs-cell53" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
<div  class="gjs-cell54" data-gjs-draggable=".gjs-cell54" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
</div>
<style>
 
.gjs-row5 {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    flex-wrap: nowrap;
    padding: 10px;
  }


  .gjs-cell51,.gjs-cell52,.gjs-cell53,.gjs-cell54 {
    min-height: 75px;
    width:25%
  }
  @media only screen and (max-width: 480px) {
.gjs-row5{
       flex-wrap: wrap;
    }

  .gjs-cell51,.gjs-cell52,.gjs-cell53,.gjs-cell54 {
    width:100%
    }
  }
      
  }
</style>`,

  // 3 parts (middle part large)
  container6: `<div  class="gjs-row6" data-gjs-droppable=".gjs-cell6" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":0,"bl":0,"br":0,"minDim":1}' data-gjs-name="Row">
<div  class="gjs-cell61" data-gjs-draggable=".gjs-row61" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
<div  class="gjs-cell-large6" data-gjs-draggable=".gjs-row-large6" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
<div  class="gjs-cell62" data-gjs-draggable=".gjs-row62" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
</div>
<style>

 
.gjs-row6 {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    flex-wrap: nowrap;
    padding: 10px;
  }
        
  .gjs-cell61,  .gjs-cell62 {
    min-height: 75px;
    width:20%
  }

  .gjs-cell-large6 {
    min-height: 75px;
    width:60%
  }

  @media only screen and (max-width: 480px) {
    .gjs-row6 {
      flex-wrap: wrap;
    }
    .gjs-cell61,.gjs-cell62,.gjs-cell-large6 {
      width:100%;
    }
  }
</style>`,

  // 2 parts top 2 parts bot
  container7: `<div  class="gjs-row7" data-gjs-droppable=".gjs-row7" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":0,"bl":0,"br":0,"minDim":1}' data-gjs-name="Row">
<div  class="gjs-cell71" data-gjs-draggable=".gjs-cell71" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
<div  class="gjs-cell72" data-gjs-draggable=".gjs-cell72" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
<div  class="gjs-cell73" data-gjs-draggable=".gjs-cell73" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
<div  class="gjs-cell74" data-gjs-draggable=".gjs-cell74" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
</div>

<style>
.gjs-row7 {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    padding: 10px;
    flex-wrap: wrap;
  }
      
  .gjs-cell71, .gjs-cell72, .gjs-cell73, .gjs-cell74 {
    {
    min-height: 75px;
    width:50%;
  }

  . {
    min-height: 75px;
    width:50%;

  }

  @media only screen and (max-width: 480px) {
    .gjs-row6 {
      flex-wrap: wrap;
    }
   .gjs-cell71, .gjs-cell72, .gjs-cell73, .gjs-cell74 {
      width:100%;
    }
  }
</style>`,
  // 2 parts top 1 parts bot
  container8: `<div  class="gjs-row8" data-gjs-droppable=".gjs-row" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":0,"bl":0,"br":0,"minDim":1}' data-gjs-name="Row">
  <div  class="gjs-cell81" data-gjs-draggable=".gjs-row81" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
  <div  class="gjs-cell82" data-gjs-draggable=".gjs-row82" data-gjs-name="Cell"></div>
  <div  class="gjs-cell-full8" data-gjs-draggable=".gjs-cell-full8" data-gjs-name="Cell"></div>
  </div>
  
  <style>
  
  .gjs-row8 {
      display: flex;
      justify-content: flex-start;
      align-items: stretch;
      padding: 10px;
      flex-wrap: wrap;
    }
        
    .gjs-cell81, .gjs-cell82 {
      min-height: 100px;
      width:50%;
    }
    .gjs-cell-full8 {
      min-height: 100px;
      width:100%;
    }
  </style>`,

  container9: `<div class="gjs-row9" data-gjs-droppable=".gjs-cell9" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":0,"bl":0,"br":0,"minDim":1}' data-gjs-name="Row">
    <div class="gjs-col91" data-gjs-draggable=".gjs-col91" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
    <div class="gjs-col92" data-gjs-droppable=".gjs-col92" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell">
    <div  class="gjs-cell92" data-gjs-draggable=".gjs-cell92" data-gjs-droppable=".gjs-cell92"  data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
    <div  class="gjs-cell93" data-gjs-draggable=".gjs-cell93" data-gjs-droppable=".gjs-cell93"  data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
    </div>
  </div>
 
 <style>
 
.gjs-row9 {
    display: flex;
    justify-content: flex-start;
    flex-direction : row;
    align-items: stretch;
    flex-wrap: nowrap;
    padding: 10px;
    min-height:150px;
  }

  .gjs-col91 {
    width: 50%;
    height:150px;
}

.gjs-col92 {
  width: 50%;
  height:150px;
}

      
.gjs-cell91 {
  height:100%;
  flex-grow: 1;
  }
   
        
.gjs-cell92 {
  height:75px;
  flex-grow: 1;
}
      
.gjs-cell93 {
  height:75px;
  flex-grow: 1;
}
  .gjs-cell-full9 {
    height: 100%;
    flex-grow: 1;
  }
 </style>`,

  // 3 parts top 3 parts bot
  container10: `<div  class="gjs-row10" data-gjs-droppable=".gjs-row10" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":0,"bl":0,"br":0,"minDim":1}' data-gjs-name="Row">
  <div  class="gjs-cell10" data-gjs-draggable=".gjs-row10" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
  <div  class="gjs-cell11" data-gjs-draggable=".gjs-row11" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
  <div  class="gjs-cell12" data-gjs-draggable=".gjs-row12" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
  <div  class="gjs-cell13" data-gjs-draggable=".gjs-row13" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
  <div  class="gjs-cell14" data-gjs-draggable=".gjs-row14" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
  <div  class="gjs-cell15" data-gjs-draggable=".gjs-row15" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
    </div>
 
 <style>
 
.gjs-row10 {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    flex-wrap: wrap;
    padding: 10px;
  }
      
  .gjs-cell10 {
    min-height: 75px;
    width : 33.33%;
    flex-grow: 1;
  }

  .gjs-cell11 {
    min-height: 75px;
    width : 33.33%;
    flex-grow: 1;
  }
  .gjs-cell12 {
    min-height: 75px;
    width : 33.33%;
    flex-grow: 1;
  }
  .gjs-cell13 {
    min-height: 75px;
    width : 33.33%;
    flex-grow: 1;
  }
  .gjs-cell14 {
    min-height: 75px;
    width : 33.33%;
    flex-grow: 1;
  }
  .gjs-cell15 {
    min-height: 75px;
    width : 33.33%;
    flex-grow: 1;
  }
 </style>`,

  // 3 parts top 2 parts bot small -> large
  container11: `<div  class="gjs-row11" data-gjs-droppable=".gjs-row11" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":0,"bl":0,"br":0,"minDim":1}' data-gjs-name="Row">
  <div class="gjs-col11" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":0,"bl":0,"br":0,"minDim":1}' data-gjs-name="Row">
    <div  class="gjs-cell11" data-gjs-draggable=".gjs-cell11" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
    <div  class="gjs-cell12" data-gjs-draggable=".gjs-cell12" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
    <div  class="gjs-cell13" data-gjs-draggable=".gjs-cell13" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
  </div>

  <div class="gjs-col12" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":0,"bl":0,"br":0,"minDim":1}' data-gjs-name="Row">
    <div  class="gjs-cell-bot-small11" data-gjs-draggable=".gjs-cell-bot-small11" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
    <div  class="gjs-cell-bot-large11" data-gjs-draggable=".gjs-cell-bot-large11" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
  </div>

  </div>
 
 <style>
 
.gjs-row11 {
    display: flex;
    justify-content: flex-start;
    flex-direction : column;
    align-items: stretch;
    flex-wrap: wrap;
    padding: 10px;
  }

  .gjs-col11 {
    display: flex;
    justify-content: flex-start;
    flex-direction : row;
    align-items: stretch;
    padding: 10px;
  }

  .gjs-col12 {
    display: flex;
    justify-content: flex-start;
    flex-direction : row;
    align-items: stretch;
    padding: 10px;
  }
  .gjs-cell11 {
    min-height: 75px;
    width : 33.33%;
    flex-grow: 1;
  }

  .gjs-cell12 {
    min-height: 75px;
    width : 33.33%;
    flex-grow: 1;
  }

  .gjs-cell13 {
    min-height: 75px;
    width : 33.33%;
    flex-grow: 1;
  }

  .gjs-cell-bot-large11 {
    width : 70%;
    min-height: 75px;
    flex-grow :1
  }

  .gjs-cell-bot-small11 {
    width : 30%;
    min-height: 75px;
    flex-grow :1
  }
 </style>`,

  // 2 parts top 2 parts bot
  container12: `<div  class="gjs-row12" data-gjs-droppable=".gjs-row12" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":0,"bl":0,"br":0,"minDim":1}' data-gjs-name="Row">
  <div class="gjs-col12" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":0,"bl":0,"br":0,"minDim":1}' data-gjs-name="Row">
    <div  class="gjs-cell-bot-small11" data-gjs-draggable=".gjs-cell-bot-small11" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
    <div  class="gjs-cell-bot-large12" data-gjs-draggable=".gjs-cell-bot-large12" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
    
  </div>
  <div class="gjs-col13"  data-gjs-droppable=".gjs-col13" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":0,"bl":0,"br":0,"minDim":1}' data-gjs-name="Row">
    <div  class="gjs-cell-bot-large14" data-gjs-draggable=".gjs-cell-bot-large12" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
    <div  class="gjs-cell-bot-small13" data-gjs-draggable=".gjs-cell-bot-small11" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
  
  </div>
  </div>
 
 <style>
 
.gjs-row12 {
    display: flex;
    justify-content: flex-start;
    flex-direction : column;
    align-items: stretch;
    flex-wrap: wrap;
    padding: 10px;
  }

  .gjs-col12 {
    display: flex;
    justify-content: flex-start;
    flex-direction : row;
    align-items: stretch;
    padding: 10px;
    height : 75px;
  }
  .gjs-col13 {
    display: flex;
    justify-content: flex-start;
    flex-direction : row;
    align-items: stretch;
    padding: 10px;
    height : 75px;
  }

  .gjs-cell-bot-small11 {
    width : 30%;
    height:100%;
    flex-grow :1
  }

  .gjs-cell-bot-large12 {
    width : 70%;
    height:100%;
    flex-grow :1
  }

  .gjs-cell-bot-small13 {
    width : 30%;
    height:100%;
    flex-grow :1
  }


  .gjs-cell-bot-large14 {
    width : 70%;
    height:100%;
    flex-grow :1
  }

 </style>`,

  // 3 equal
  container13: `<div  class="gjs-row13" data-gjs-droppable=".gjs-cell6" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":0,"bl":0,"br":0,"minDim":1}' data-gjs-name="Row">
  <div  class="gjs-cell131" data-gjs-draggable=".gjs-cell131" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
  <div  class="gjs-cell131" data-gjs-draggable=".gjs-cell131" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell"></div>
  <div  class="gjs-cell131" data-gjs-draggable=".gjs-cell131" data-gjs-name="Cell"></div>
  </div>
  <style>
  
   
  .gjs-row13 {
      display: flex;
      justify-content: flex-start;
      align-items: stretch;
      flex-wrap: nowrap;
      padding: 10px;
    }
        
    .gjs-cell131{
      min-height: 75px;
      width:33.33%
    }
  
  </style>`,

  // 70-30
  container14: `<div  class="gjs-row14" data-gjs-droppable=".gjs-row14" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":0,"bl":0,"br":0,"minDim":1}' data-gjs-name="Row">
  <div  class="gjs-cell141" data-gjs-draggable=".gjs-cell141" data-gjs-resizable='{"tl":0,"tc":0,"tr":0,"cl":0,"cr":1,"bl":0,"br":0,"minDim":1,"bc":0,"currentUnit":1,"step":0.2}' data-gjs-name="Cell" ></div>
  <div  class="gjs-cell142" data-gjs-draggable=".gjs-cell142" data-gjs-name="Cell" ></div>
</div>
<style>
 
.gjs-row14 {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  flex-wrap: nowrap;
  padding: 10px;
}
    
.gjs-cell141 {
  min-height: 75px;
    width : 70% ;
}

.gjs-cell142 {
  min-height: 75px;
    width : 30%;
    flex-grow :1
}

@media only screen and (max-width:400px){
  .gjs-row14 {
    flex-wrap: wrap;
  }
      
  .gjs-cell141 , .gjs-cell142 {
      width : 100% ;
  }
}

</style>`
};

export default Layouts;
