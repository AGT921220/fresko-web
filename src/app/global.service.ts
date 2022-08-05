import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(
    private toast:ToastrService
  ) { 

  }

  showSuccessToast(message, title = null) {
    return this.toast.success(message, title);
  }

  showErrorToast(message, title = null) {
    return this.toast.error(message, title);
  }

  showInfoToast(message, title = null) {
    return this.toast.info(message, title);
  }
}
