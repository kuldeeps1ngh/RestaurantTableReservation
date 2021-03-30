import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PERSON, UserServiceService } from '../user-service.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit, OnDestroy {
  addReservationFrmGrp: FormGroup;
  submitted = false;
  tableArr = [
    { id: 1, tableLocation: 'front', capacity: 2 },
    { id: 2, tableLocation: 'back', capacity: 6 },
    { id: 3, tableLocation: 'left', capacity: 3 },
    { id: 4, tableLocation: 'right', capacity: 4 },
    { id: 5, tableLocation: 'middle', capacity: 8 }
  ]
  timeSlotArr = [
    { id: 1, time: '10-11 AM', disabled: false },
    { id: 2, time: '11-12 PM', disabled: false },
    { id: 3, time: '12-01 PM', disabled: false },
    { id: 4, time: '01-02 PM', disabled: false },
    { id: 5, time: '02-03 PM', disabled: false },
    { id: 6, time: '03-04 PM', disabled: false },
    { id: 7, time: '04-05 PM', disabled: false },
    { id: 8, time: '05-06 PM', disabled: false },
    { id: 9, time: '06-07 PM', disabled: false },
    { id: 10, time: '07-08 PM', disabled: false },
    { id: 11, time: '08-09 PM', disabled: false },
  ]
  todayDate = new Date();
  allReservationListing;

  constructor(private dbService: NgxIndexedDBService, private fb: FormBuilder,
    private userService: UserServiceService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.setForm();
    this.getAllList();
  }

  ngOnDestroy() {
  }

  getAllList() {
    this.dbService.getAll('person').subscribe((tables: PERSON[]) => {
      this.allReservationListing = tables;
    });
  }

  setForm() {
    this.addReservationFrmGrp = this.fb.group({
      tableLocation: ['', [Validators.required]],
      slot: ['', [Validators.required]],
    })
  }

  get f() { return this.addReservationFrmGrp.controls; }

  submit() {
    this.submitted = true;
    if (!this.addReservationFrmGrp.valid) {
      return console.log('invalidForm', this.f);
    }
    const obj = this.addReservationFrmGrp.getRawValue();
    this.addPerson(obj);
  }

  selectTable(data) {
    console.log(data);
    this.f.slot.setValue('');
    this.timeSlotArr.forEach(element2 => {
      element2.disabled = false;
    })
    this.allReservationListing.forEach(element => {
      if (data.id === element.tableName.id) {
        this.timeSlotArr.forEach(element1 => {
          if (element.timeSlot.id === element1.id) {
            element1.disabled = true;
          } else {
            // element1.disabled = false;
          }
        });
      }
    });
  }

  addPerson(obj) {
    this.dbService
  .add('person', {
    tableName: obj.tableLocation,
    timeSlot: obj.slot,
  })
  .subscribe((key) => {
    this.userService.openSnackBar('Table reservation added successfully');
    this.router.navigate(['../']);
  });
  }

}
