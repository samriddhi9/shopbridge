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
  public paginateditems: Products[] = [];
  public pagenumbers: any;
  public treats: Options[] = [];
  public tents: Options[] = [];
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
  public urlpattern: any = ``
  public atwhatpage: any = 1;
  public result: any = []
  @ViewChild('addeditModal') addeditModal: ElementRef;
  @ViewChild('deleteModal') deleteModal: ElementRef;

  constructor(private homeservice: HomeService) {

  }

  ngOnInit(): void {
    this.productslist = [];
    this.treats = [];
    this.tents = [];
    this.toys = [];
    this.pagenumbers = [];
    this.getProducts();
    this.getFilterMenus();
    $("#treats").hide();
    $("#tents").hide();
    $("#toys").hide();
    $(".treats-menu").click(function () {
      $("#treats").slideToggle();
    });
    $(".tents-menu").click(function () {
      $("#tents").slideToggle();
    });
    $(".toys-menu").click(function () {
      $("#toys").slideToggle();
    });

  }

  paginate(array: any, page_size: any, page_number: any) {
    this.atwhatpage = page_number;
    this.paginateditems = array.slice((page_number - 1) * page_size, page_number * page_size);
  }

  //method to access service to fetch products
  getProducts() {
    this.pagenumbers = []
    this.homeservice.loadProducts().subscribe((res: any) => {
      this.productslist = res;
      // all item paginated
      let len = this.productslist.length;
      let perPage = len / 6;
      let ceil = Math.ceil(perPage);
      for (let i = 1; i <= ceil; i++) {
        this.pagenumbers.push(i)
      }
      console.log(this.pagenumbers);
      this.paginate(this.productslist, 6, this.atwhatpage);
    });

  }

  //method to access service to fetch products
  getFilterMenus() {
    this.homeservice.loadFilterMenus().subscribe((res: any) => {
      this.treats = res.treats;
      this.tents = res.tents;
      this.toys = res.toys;
    });
  }

  //method to save data
  onSubmit(addeditForm: any) {
    if (this.action === 'add') {
      this.homeservice.addnewProduct(addeditForm.value).subscribe((res: any) => {
        console.log(res)
        this.submitstatus = 1;
        let that = this;
        setTimeout(function () {
          that.submitstatus = 2
        }, 2000);
        setTimeout(function () {
          $(that.addeditModal.nativeElement).modal('hide');
        }, 3000);
        setTimeout(function () {
          if (that.ProductFound === 2) {
            that.paginate(that.filteredlist, 6, that.atwhatpage)
          }
          else if (that.ProductFound === 1) {
            that.getProducts();
          }
        }, 4000);
      });
    }
    else {
      this.homeservice.updateProduct(this.editid, addeditForm.value).subscribe((res: any) => {
        console.log(res)
        this.submitstatus = 1;
        let that = this;
        setTimeout(function () {
          that.submitstatus = 2
        }, 2000);
        setTimeout(function () {
          $(that.addeditModal.nativeElement).modal('hide');
        }, 3000);
        setTimeout(function () {
          if (that.ProductFound === 2) {
            that.paginate(that.filteredlist, 6, that.atwhatpage)
          }
          else if (that.ProductFound === 1) {
            that.getProducts();
          }
        }, 4000);
      })
    }
  }

  //to open add/edit modal
  openModal(purpose: any, index?: any, id?: any, atwhatpage?: any) {
    this.submitstatus = 0;
    $(this.addeditModal.nativeElement).modal('show');
    this.action = purpose;
    if (purpose === 'edit') {
      this.editIndex = index;
      this.editid = id;
    }

    if (this.ProductFound === 2) {
      this.paginate(this.filteredlist, 6, atwhatpage)
    }
    else if (this.ProductFound === 1) {
      this.getProducts();
    }
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
      this.deletestatus = 1;
      let that = this;
      setTimeout(function () {
        that.deletestatus = 2
      }, 2000);
      setTimeout(function () {
        $(that.deleteModal.nativeElement).modal('hide');
        that.hidefilters();
        that.ProductFound = 1
      }, 3000);
    })
  }

  applyfilters(treats: any, tents: any, toys: any) {

    this.options = [];
    treats.forEach((element: any) => {
      if (element.checked) {
        this.options.push(element.name)
      }
    });
    tents.forEach((element: any) => {
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

    let resArr: Products[] = [];
    this.filteredlist = [];
    this.pagenumbers = []

    options.forEach((element: any) => {
      this.result = this.productslist.filter(s => (s.name.toLowerCase().includes(element.toLowerCase())) ||
        (s.price.toLowerCase().includes(element.toLowerCase())) || (s.desc.toLowerCase().includes(element.toLowerCase())));

      resArr.push(this.result)
    });

    if (resArr) {
      resArr.forEach((i: any) => {
        i.forEach((j: any) => {
          //tempArr.push(j)
          this.filteredlist.push(j)
        });
      })
      // console.log(tempArr);
      // var idArr = tempArr.map(function(item){ return item.id });
      // console.log(idArr);
    }
    else {
      this.filteredlist = []
    }

    if (this.filteredlist.length && this.filteredlist.length === this.productslist.length) {
      this.ProductFound = 1;
      this.getProducts();
    }
    else if (this.filteredlist.length && this.filteredlist.length < this.productslist.length) {
      this.ProductFound = 2;

      // filtered item paginated
      let len = this.filteredlist.length;
      let perPage = len / 6;
      let ceil = Math.ceil(perPage);
      for (let i = 1; i <= ceil; i++) {
        this.pagenumbers.push(i)
      }
      console.log(this.pagenumbers);
      this.paginate(this.filteredlist, 6, this.atwhatpage);
    }
    else if (this.filteredlist.length === 0) {
      this.ProductFound = 3;
    }
  }

  searchByText(text: any) {
    this.filteredlist = []
    let resArr: Products[] = [];
    this.pagenumbers = []
    this.treats.forEach((element: any) => {
      element.checked = false
    });
    this.tents.forEach((element: any) => {
      element.checked = false
    });
    this.toys.forEach((element: any) => {
      element.checked = false
    });

    this.productslist.forEach((s: any) => {
      if ((s.name.toLowerCase().includes(text.toLowerCase())) ||
        (s.price.toLowerCase().includes(text.toLowerCase())) || (s.desc.toLowerCase().includes(text.toLowerCase()))) {
        resArr.push(s)
      }
    })

    this.filteredlist = resArr.length > 0 ? resArr : []
    if (this.filteredlist.length && this.filteredlist.length === this.productslist.length) {
      this.ProductFound = 1;
      this.getProducts();
    }
    else if (this.filteredlist.length && this.filteredlist.length < this.productslist.length) {
      this.ProductFound = 2;

      // filtered item paginated
      let len = this.filteredlist.length;
      let perPage = len / 6;
      let ceil = Math.ceil(perPage);
      for (let i = 1; i <= ceil; i++) {
        this.pagenumbers.push(i)
      }
      console.log(this.pagenumbers);
      this.paginate(this.filteredlist, 6, this.atwhatpage);
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
    this.tents.forEach((element: any) => {
      element.checked = false
    });
    this.toys.forEach((element: any) => {
      element.checked = false
    });
  }

}