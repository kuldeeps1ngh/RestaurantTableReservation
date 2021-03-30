import { Component, OnInit } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { PERSON, UserServiceService } from '../user-service.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
  dataSource: any;
  dataSourceBackup: any;
  todayDate = new Date();
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
  selectedTimeFilter;
  selectedCapacityFilter;

  constructor(private dbService: NgxIndexedDBService, private userService: UserServiceService) { }

  ngOnInit() {
    this.getAllList();
  }

  getAllList() {
    this.dbService.getAll('person').subscribe((tables: PERSON[]) => {
      this.dataSource = tables;
      this.dataSourceBackup = tables;
    });
  }

  deletePerson(id: number) {
    this.dbService.delete('person', id).subscribe((allPeople) => {
      this.userService.openSnackBar(`Table: ${id} deleted successfully`);
      this.dataSourceBackup = allPeople;
      this.dataSource = allPeople;
    });
  }

  clearAllEntries() {
    this.dbService.clear('person').subscribe((successDeleted) => {
      this.userService.openSnackBar('All table reservation list cleared');
      this.getAllList()
    });
  }

  selectTimeFilter(data) {
    const filterVal = Number(data);
    this.selectedTimeFilter = filterVal
    if (!data) {
      this.dataSource = this.dataSourceBackup;
      return;
    }
    this.dataSource = [];
    this.dataSourceBackup.forEach(element => {
      if (this.selectedCapacityFilter) {
        if (filterVal === element.timeSlot.id && this.selectedCapacityFilter === element.tableName.capacity) {
          this.dataSource.push(element)
        }
      } else {
        if (filterVal === element.timeSlot.id) {
          this.dataSource.push(element)
        }
      }
    });
  }

  selectCapacityFitler(data) {
    const filterVal = Number(data);
    this.selectedCapacityFilter = filterVal;
    if (!data) {
      this.dataSource = this.dataSourceBackup;
      return;
    }
    this.dataSource = [];
    this.dataSourceBackup.forEach(element => {
      if (this.selectedTimeFilter) {
        if (filterVal === element.tableName.capacity && this.selectedTimeFilter === element.timeSlot.id) {
          this.dataSource.push(element)
        }
      } else {
        if (filterVal === element.tableName.capacity) {
          this.dataSource.push(element)
        }
      }
    });
  }

}
