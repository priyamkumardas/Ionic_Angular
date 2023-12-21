import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productFilter',
})
export class ProductFilterPipe implements PipeTransform {
  transform(items: any[], search: string, status?: string): any {
    //console.log(items,search)
    //console.log(!items || (!search && !status))
    if (!items || (!search && !status)) {
      return items;
    }
    search = search.toLowerCase();
    const results = items.filter((item) => {
      if (
        search &&
        status &&
        item.status === status &&
        item.name.toLowerCase().includes(search)
      ) {
        return item;
      } else if (
        search &&
        !status &&
        item.name.toLowerCase().includes(search)
      ) {
        return item;
      } else if (!search && status && item.status === status) {
        return item;
      }
    });
    // console.log(results);
    return results;
  }
}
