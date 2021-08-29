import { Component, OnInit } from '@angular/core';
import { HomeService } from "./home.service";
import { Products, Options } from "./item.modal";
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  public productslist: Products[] = [];
  public filteredlist: Products[] = [];
  public treats: Options[] = [];
  public camps: Options[] = [];
  public toys: Options[] = [];
  public action: any;
  public editIndex: any;
  public editid: any;
  public deleteid: any;
  public deletestatus: any = 0;
  public submitstatus: any = 0;
  public options: Options[] = [];
  public ProductFound: any = 1;
  public searchText: any;
  @ViewChild('addeditModal') addeditModal: ElementRef;
  @ViewChild('deleteModal') deleteModal: ElementRef;

  constructor(private homeservice: HomeService) { }

  ngOnInit(): void {
    this.productslist = [];
    this.treats = [];
    this.camps = [];
    this.toys = [];
    this.getProducts();
    this.getFilterMenus();
    $("#treats").hide();
    $("#camps").hide();
    $("#toys").hide();
    $(".treats-menu").click(function () {
      $("#treats").slideToggle();
    });
    $(".camps-menu").click(function () {
      $("#treats").slideToggle();
    });
    $(".toys-menu").click(function () {
      $("#treats").slideToggle();
    });
  }

  //method to access service to fetch products
  getProducts() {
    this.homeservice.loadProducts().subscribe((res: any) => {
      this.productslist = res;
    });
  }

  //method to access service to fetch products
  getFilterMenus() {
    this.homeservice.loadFilterMenus().subscribe((res: any) => {
      this.treats = res.treats;
      this.camps = res.camps;
      this.toys = res.toys;
    });
  }

  //method to save data
  onSubmit(addeditForm: any) {
    if (this.action === 'add') {
      this.homeservice.addnewProduct(addeditForm.value).subscribe((res: any) => {
        console.log(res)
        this.getProducts();
        this.submitstatus = 1;
        let that = this;
        setTimeout(function () {
          that.submitstatus = 2
        }, 2000);
        setTimeout(function () {
          $(that.addeditModal.nativeElement).modal('hide');
        }, 3000);
      });
    }
    else {
      this.homeservice.updateProduct(this.editid, addeditForm.value).subscribe((res: any) => {
        console.log(res)
        this.getProducts();
        this.submitstatus = 1;
        let that = this;
        setTimeout(function () {
          that.submitstatus = 2
        }, 2000);
        setTimeout(function () {
          $(that.addeditModal.nativeElement).modal('hide');
        }, 3000);
      })
    }
  }

  //to open add/edit modal
  openModal(purpose: any, index?: any, id?: any) {
    this.submitstatus = 0;
    $(this.addeditModal.nativeElement).modal('show');
    this.action = purpose;
    this.editIndex = index;
    this.editid = id;
  }

  //open delete confirmation modal
  opendeleteModal(id: any) {
    this.deletestatus = 0
    $(this.deleteModal.nativeElement).modal('show');
    this.deleteid = id
  }

  //to delete product from backend
  deleteProduct() {
    this.homeservice.deleteProduct(this.deleteid).subscribe((res: any) => {
      console.log(res)
      this.getProducts();
      this.deletestatus = 1;
      let that = this;
      setTimeout(function () {
        that.deletestatus = 2
      }, 2000);
      setTimeout(function () {
        $(that.deleteModal.nativeElement).modal('hide');
      }, 3000);
    })
  }

  applyfilters(treats: any, camps: any, toys: any) {
    debugger
    this.options = [];
    treats.forEach((element: any) => {
      if (element.checked) {
        this.options.push(element.name)
      }
    });
    camps.forEach((element: any) => {
      if (element.checked) {
        this.options.push(element.name)
      }
    });
    toys.forEach((element: any) => {
      if (element.checked) {
        this.options.push(element.name)
      }
    });
    console.log(this.options)
    this.searchProductss(this.options)
  }

  searchProductss(options: any) {
    debugger
    let resArr: Products[] = [];

    options.forEach((element: any) => {
      let result: any;
      result = this.productslist.find(s => (s.name.toLowerCase().includes(element.toLowerCase())) ||
        (s.price.toLowerCase().includes(element.toLowerCase())) || (s.desc.toLowerCase().includes(element.toLowerCase())));

      if (result) {
        resArr.push(result)
      }
    });

    console.log(resArr);

    this.filteredlist = resArr.length > 0 ? resArr : []
    if (this.filteredlist.length && this.filteredlist.length === this.productslist.length) {
      this.ProductFound = 1;
    }
    else if (this.filteredlist.length && this.filteredlist.length < this.productslist.length) {
      this.ProductFound = 2;
    }
    else if (this.filteredlist.length === 0) {
      this.ProductFound = 3;
    }
  }

  searchByText(text: any) {
    let resArr: Products[] = [];

    this.productslist.forEach((s: any) => {
      if ((s.name.toLowerCase().includes(text.toLowerCase())) ||
        (s.price.toLowerCase().includes(text.toLowerCase())) || (s.desc.toLowerCase().includes(text.toLowerCase()))) {
        resArr.push(s)
      }
    })

    this.filteredlist = resArr.length > 0 ? resArr : []
    if (this.filteredlist.length && this.filteredlist.length === this.productslist.length) {
      this.ProductFound = 1;
    }
    else if (this.filteredlist.length && this.filteredlist.length < this.productslist.length) {
      this.ProductFound = 2;
    }
    else if (this.filteredlist.length === 0) {
      this.ProductFound = 3;
    }
  }

  hidefilters() {
    this.getProducts();
    this.ProductFound = 1;
    this.searchText = ''
    this.treats.forEach((element: any) => {
      element.checked = false
    });
    this.camps.forEach((element: any) => {
      element.checked = false
    });
    this.toys.forEach((element: any) => {
      element.checked = false
    });
  }

}