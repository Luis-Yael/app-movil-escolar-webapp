import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { FacadeService } from 'src/app/services/facade.service';
import { EliminarUserModalComponent } from '../../modals/eliminar-user-modal/eliminar-user-modal.component';
import { NotificationService } from 'src/app/services/tools/notification.service';

@Component({
    selector: 'app-alumnos-screen',
    templateUrl: './alumnos-screen.component.html',
    styleUrls: ['./alumnos-screen.component.scss'],
    standalone: false
})
export class AlumnosScreenComponent implements OnInit {

  public name_user: string = "";
  public rol: string = "";
  public lista_alumnos: any[] = [];

  //Para la tabla
  displayedColumns: string[] = ['matricula', 'nombre', 'email', 'fecha_nacimiento', 'edad', 'curp', 'rfc', 'telefono', 'ocupacion', 'editar', 'eliminar'];
  dataSource = new MatTableDataSource<DatosUsuario>(this.lista_alumnos as DatosUsuario[]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private facadeService: FacadeService,
    private alumnosService: AlumnosService,
    private notificationService: NotificationService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    this.obtenerAlumnos();
  }

  //Obtener alumnos
  public obtenerAlumnos() {
    this.alumnosService.obtenerListaAlumnos().subscribe(
      (response) => {
        this.lista_alumnos = response;
        if (this.lista_alumnos.length > 0) {
          //Agregar datos del nombre e email
          this.lista_alumnos.forEach(usuario => {
            usuario.first_name = usuario.user.first_name;
            usuario.last_name = usuario.user.last_name;
            usuario.email = usuario.user.email;
          });
          this.dataSource = new MatTableDataSource<DatosUsuario>(this.lista_alumnos as DatosUsuario[]);
        }
      }, (error) => {
        this.notificationService.error("No se pudo obtener la lista de usuarios");
      }
    );
  }

  public goEditar(idUser: number, isUserId?: boolean) {
    // Administrador puede editar cualquier alumno
    // Maestro puede editar cualquier alumno
    // Alumno solo puede editar su propio registro
    const userId = Number(this.facadeService.getUserId());
    // Usar id como identificador para editar
    if (this.rol === 'administrador' || this.rol === 'maestro' || (this.rol === 'alumno')) {
      this.router.navigate(['/registro-usuarios', 'alumno', idUser]);
    } else {
      this.notificationService.error('No tienes permisos para editar este alumno');
    }
  }

  public delete(idUser: number, isUserId?: boolean) {
    // Administrador puede eliminar cualquier alumno
    // Maestro puede eliminar cualquier alumno
    // Alumno solo puede eliminar su propio registro
    const userId = Number(this.facadeService.getUserId());
    // Usar id como identificador para eliminar
    if (this.rol === 'administrador' || this.rol === 'maestro' || (this.rol === 'alumno' && userId === idUser)) {
      const dialogRef = this.dialog.open(EliminarUserModalComponent, {
        data: { id: idUser, rol: 'alumno' },
        height: '288px',
        width: '328px',
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result?.isDelete) {
          this.obtenerAlumnos();
        } else {
          this.notificationService.error('Alumno no se ha podido eliminar.');
        }
      });
    } else {
      this.notificationService.error('No tienes permisos para eliminar este alumno');
    }
  }
}
//Esto va fuera de la llave que cierra la clase
export interface DatosUsuario {
  id: number,
  matricula: number;
  first_name: string;
  last_name: string;
  email: string;
  fecha_nacimiento: string,
  curp: string,
  rfc: string,
  edad: number,
  telefono: string,
  ocupacion: string

}
