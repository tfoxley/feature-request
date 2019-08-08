import { Component, OnInit } from '@angular/core';
import { Feature } from './../../interfaces/feature';

@Component({
  selector: 'feature-holder',
  templateUrl: './feature-holder.component.html',
  styleUrls: ['./feature-holder.component.css']
})
export class FeatureHolderComponent implements OnInit {
  features: Feature[];
  featureTitle: string;
  featureId: number;
  clientOptions: object[];
  clientOptionsFiltered: object[];
  clientLabel: string = '';
  productAreaOptions: object[];

  constructor() {}

  ngOnInit() {
    this.featureId = 3;
    this.featureTitle = '';
    this.clientOptions = [
      { title: 'Client A', value: 'clientA' },
      { title: 'Client B', value: 'clientB' },
      { title: 'Client C', value: 'clientC' },
      { title: 'Client D', value: 'clientD' }
    ];
    this.productAreaOptions = [
      { title: 'Policies', value: 'Policies' },
      { title: 'Billing', value: 'Billing' },
      { title: 'Claims', value: 'Claims' },
      { title: 'Reports', value: 'Reports' }
    ];
    this.features = [
      {
        id: 1,
        title: 'More Cowbell',
        description: 'The client would like more cowbell',
        client: 'Walken Inc',
        priority: 1,
        targetDate: '9/15/2019',
        productArea: 'Reports'
      },
      {
        id: 2,
        title: 'Spanish Translation',
        description:
          'The client has asked that we build in the ability to translate to Spanish',
        client: 'Veritas',
        priority: 1,
        targetDate: '10/24/2019',
        productArea: 'Policies'
      }
    ];
  }

  addFeature(data) {
    if (data.title.trim().length == 0) {
      return;
    } else {
      this.features.push({
        id: this.featureId,
        title: data.title,
        description: data.description,
        client: this.clientLabel,
        priority: data.priority,
        targetDate: data.targetDate,
        productArea: data.productArea
      });
    }

    data.title = '';
    this.featureId++;
  }

  deleteFeature(id: number) {
    this.features = this.features.filter(feature => feature.id !== id);
  }

  filterData(term) {
    if (term) {
      this.clientOptionsFiltered = this.clientOptions.filter(
        client => client['title'].toLowerCase().indexOf(term.toLowerCase()) > -1
      );
    } else {
      this.clientOptionsFiltered = this.clientOptions;
    }
  }

  optionSelected(client) {
    this.clientLabel = client.title;
  }
}
