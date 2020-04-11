import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EConsumption } from '../models/econsumption';
import { EconsumptionService } from '../services/econsumption.service';
import { CommonValueService } from '../services/common-value.service';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { DatePipe } from '@angular/common';
import { CustomerCategory } from '../models/customer-category';
import { CustomerCategoryService } from '../services/customer-category.service';

@Component({
  selector: 'app-econsumptions-details',
  templateUrl: './econsumptions-details.component.html',
  styleUrls: ['./econsumptions-details.component.css']
})
export class EconsumptionsDetailsComponent implements OnInit {

  eConsumption: EConsumption = new EConsumption();
  isReadOnly = true;
  id: string;

  customerCategoryList: CustomerCategory[] = [];
  selectedCustomerCategory;

  constructor(
    private route: ActivatedRoute,
    private eConsumptionService: EconsumptionService,
    private customerCategoryService: CustomerCategoryService,
    private toastr: ToastrService,
    private commonValuesService: CommonValueService
  ) { }

  ngOnInit() {

    this.customerCategoryService.getAll().subscribe(data => {
      console.log(data);
      this.customerCategoryList = data;
    });

    this.id = this.route.snapshot.paramMap.get('id');
   
    if (this.id) {
      this.eConsumptionService.get(this.id).subscribe(data => {
        console.log(data);
        this.eConsumption = data;
      });

    }
    else {
      this.isReadOnly = false;
    }

  }

  onSubmit() {

    delete this.eConsumption.consumptionPlannedDate;
   
    this.eConsumptionService.addOrUpdate(this.eConsumption).subscribe(data => {
      console.log(data);
      this.isReadOnly = true;
    });
  }

  edit() {
    this.isReadOnly = !this.isReadOnly;
  }

  // onCPChanged(value) {

  //   if(value){
  //     // console.log(value);
  //     this.eConsumption.consumptionPlannedCost = value * this.kwhCost;
  //   }
  // }

  // onCAChanged(value) {

  //   if(value){
  //     // console.log(value);
  //     this.eConsumption.consumptionActualCost = value * this.kwhCost;
  //   }
  // }

  getCost() {

    console.log();

    let calc = {
      customerCategoryId: this.selectedCustomerCategory,
      consumptionValue: this.eConsumption.consumptionPlanned
    };

    console.log(calc);

    this.eConsumptionService.calculateConsumption(calc).subscribe(data => {
      console.log(data);
      this.eConsumption.consumptionPlannedCost = parseInt(data.toString());
    });

    this.toastr.success("Calculation Submitted");
  }


}
