import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { NotificationService } from 'src/app/services/tools/notification.service';

@Component({
    selector: 'app-registro-admin',
    templateUrl: './registro-admin.component.html',
    styleUrls: ['./registro-admin.component.scss'],
    standalone: false
})
export class RegistroAdminComponent implements OnInit {

  @Input() rol: string = "";
  @Input() datos_user: any = {};

  public admin:any = {};
  public errors:any = {};
  public editar:boolean = false;
  public idUser: number = 0;

  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private administradoresService: AdministradoresService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    //El primer if valida si existe un parámetro en la URL
    if(this.activatedRoute.snapshot.params['id'] !== undefined){
      this.editar = true;
      //Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idUser = this.activatedRoute.snapshot.params['id'];
      //Al iniciar la vista asignamos los datos del user
      this.admin = this.datos_user;
    }else{
      // Si no va a this.editar, entonces inicializamos el JSON para registro nuevo
      this.admin = this.administradoresService.esquemaAdmin();
      this.admin.rol = this.rol;
    }
    //Imprimir datos en consola
  }

  public regresar(){
    this.location.back();
  }

  //Funciones para password
  public showPassword()
  {
    if(this.inputType_1 === 'password'){
      this.inputType_1 = 'text';
      this.hide_1 = true;
    }
    else{
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  public showPwdConfirmar()
  {
    if(this.inputType_2 === 'password'){
      this.inputType_2 = 'text';
      this.hide_2 = true;
    }
    else{
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

  public registrar(){
    this.errors = {};
    this.errors = this.administradoresService.validarAdmin(this.admin, this.editar);
    if(Object.keys(this.errors).length > 0){
      return;
    }
    // Validar si las contraseñas coinciden

    //Validar la contraseña
    if(this.admin.password === this.admin.confirmar_password){
      // Ejecutamos el servicio de registro
      this.administradoresService.registrarAdmin(this.admin).subscribe(
        (response) => {
          // Redirigir o mostrar mensaje de éxito
          this.notificationService.success("Administrador registrado exitosamente");
          this.router.navigate(['/administrador']);
        },
        (error) => {
          // Manejar errores de la API
          this.notificationService.error("Error al registrar administrador");
        }
      );
    }else{
      this.notificationService.error("Las contraseñas no coinciden");
      this.admin.password="";
      this.admin.confirmar_password="";
    }
  }

  public actualizar(){
    // Validación de los datos
    this.errors = {};
    this.errors = this.administradoresService.validarAdmin(this.admin, this.editar);
    if(Object.keys(this.errors).length > 0){
      return;
    }
    // Ejecutamos el servicio de actualización
    this.administradoresService.actualizarAdmin(this.admin).subscribe(
      (response) => {
        // Redirigir o mostrar mensaje de éxito
        this.notificationService.success("Administrador actualizado exitosamente");
      this.router.navigate(['/administrador']);
      },
      (error) => {
        // Manejar errores de la API
        this.notificationService.error("Error al actualizar administrador");
      }
    );

  }

  // Función para los campos solo de datos alfabeticos
  public soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permitir solo letras (mayúsculas y minúsculas) y espacio
    if (
      !(charCode >= 65 && charCode <= 90) &&  // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      charCode !== 32                         // Espacio
    ) {
      event.preventDefault();
    }
  }
}
