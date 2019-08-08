import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeatureHolderComponent } from './components/feature-holder/feature-holder.component';

const routes: Routes = [
  {
    path: '',
    component: FeatureHolderComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
