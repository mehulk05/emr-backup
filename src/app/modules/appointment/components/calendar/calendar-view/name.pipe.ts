import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameFilter'
})
export class NamePipe implements PipeTransform {
  transform(
    items: any[],
    searchName: string,
    secondarySearch: string,
    searchNameIdentifier: string,
    secondarySearchIdentifier: string
  ): any[] {
    if (!items) return [];
    if (
      (!searchName || searchName.length === 0) &&
      (!secondarySearch || secondarySearch.length === 0)
    ) {
      return items;
    }
    const results = items.filter((data: any) => {
      if (searchName.length > 0 && !secondarySearch) {
        return data[searchNameIdentifier]?.includes(searchName);
      } else if (!searchName && secondarySearch.length > 0) {
        return data[secondarySearchIdentifier] == secondarySearch;
      } else if (searchName.length > 0 && secondarySearch.length > 0) {
        return (
          data[searchNameIdentifier]?.includes(searchName) &&
          data[secondarySearchIdentifier] == secondarySearch
        );
      }
      if (searchName.length > 0) {
        return data[searchNameIdentifier]?.includes(searchName);
      }
    });
    console.log(results);
    return results;
  }
}
