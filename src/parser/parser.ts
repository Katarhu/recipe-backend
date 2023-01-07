import { HttpService } from '@nestjs/axios';

export class Parser {
  constructor(private http: HttpService) {}

  findItem() {
    this.http
      .post(
        'https://api.catalog.ecom.silpo.ua/api/2.0/exec/EcomCatalogGlobal',
        {
          method: 'GetSimpleCatalogItems',
          data: {
            customFilter: 'морква',
            filialId: '2257',
            skuPerPage: 100,
            pageNumber: 1,
          },
        },
      )
      .subscribe((value) => {
        const carrot = value.data.items.find(

          (value) => value.name.toLowerCase() === 'морква',
        );
        console.log(carrot);
      });
  }
}
