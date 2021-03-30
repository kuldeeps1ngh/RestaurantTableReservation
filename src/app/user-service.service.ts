import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

export interface PERSON {
  tableName: string;
  timeSlot: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private _snackBar: MatSnackBar) { }

  // function to open snackbar
  openSnackBar(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 2000,
    });
  }


}
