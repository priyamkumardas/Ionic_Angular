import { NgModule } from '@angular/core';

import { LanguagePipe } from './language.pipe';
import { ProductFilterPipe } from './product-filter.pipe';
import { TextTruncatePipe } from './text-truncate.pipe';
import { RemoveUnderscorePipe } from './remove-underscore.pipe';

@NgModule({
  imports: [],
  declarations: [LanguagePipe, ProductFilterPipe, TextTruncatePipe, RemoveUnderscorePipe],
  exports: [LanguagePipe, ProductFilterPipe, TextTruncatePipe, RemoveUnderscorePipe],
})
export class PipeModule {
  static forRoot() {
    return {
      ngModule: PipeModule,
      providers: [LanguagePipe,],
    };
  }
}
