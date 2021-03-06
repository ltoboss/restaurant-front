import { Component, OnInit } from '@angular/core';
import { TablesService } from '../../services/tables.service'
import { ZonesService } from '../../services/zones.service'
import { HttpClient } from '@angular/common/http';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ModalModule, BsModalRef,BsModalService } from 'ngx-bootstrap/modal';
import {FormBuilder, Validators} from '@angular/forms'

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TableComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'size', 'zone', 'isActive', 'actions'];
  private tables = [];
  private zones = [];
  private info_row = null;
  private form;

  constructor(
    private tablesService: TablesService,
    private zonesService: ZonesService,
    private http: HttpClient,
    public modalService: BsModalService,
    private formBuilder: FormBuilder
  ) {

    this.form = formBuilder.group({
      name: ['', Validators.required],
      size: ['', Validators.required],
      zone: ['', Validators.required],
      isActive: [''], 
    });

    
  }

  async ngOnInit() {
    
    await this.refreshData();

    this.zonesService.getAllZones().subscribe((result:any)=>{
      this.zones = result;
      console.log(result)
    });
  }

  async refreshData(){
    await this.tablesService.getAllTables().subscribe((result:any)=>{
      this.tables = result;
      console.log(result)
    });
  }

  async delete(item){
    await this.tablesService.deleteATable(item.id).subscribe((result:any)=>{
      this.refreshData();
    });
  }

  loadInfo(item){
    this.form.value.name = item.name;
    this.form.value.size = item.size;
    this.form.value.zone = item.zone;
    this.form.value.isActive = item.isActive;
  }

  async submit(){

    console.log(this.form.value)

    if(this.form.valid){

      let data = {
        "name":this.form.value.name,
        "size":this.form.value.size,
        "isActive":this.form.value.isActive,
        "zone":this.form.value.zone,
      }

      if(this.info_row!=null)
        data["id"] = this.info_row.id;


      await this.tablesService.saveATables(data).subscribe(async (result:any)=>{
        console.log(result)
        await this.refreshData();
        this.modalRef.hide();
      });

    }
  }
  modalRef: BsModalRef;
  openModal(info:any, modalTable): void {
    this.modalRef = this.modalService.show(modalTable);
    this.info_row = info;
  }

}