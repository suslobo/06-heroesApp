import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValueChangeEvent } from '@angular/forms';
import { Publisher, Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, pipe, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {

  //creamos formulario reactivo. Es heroForm
  public heroForm = new FormGroup({
      id: new FormControl<string>(''),
      superhero: new FormControl<string>('', { nonNullable: true}),
      publisher: new FormControl<Publisher>( Publisher.DCComics ),
      alter_ego: new FormControl(''),
      first_appearance: new FormControl(''),
      characters: new FormControl(''),
      alt_img: new FormControl(''),
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ];

  //hacemos la inyección de nuestro servicio
  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    //snackbar
    private snackbar: MatSnackBar,
    //mensaje de confirmación
    private dialog: MatDialog,
   ) {}

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  ngOnInit(): void {
    //los parámetros que vienen por el url
    // hay que poner en el constructor el AtivatedRoute y el Router

    if ( !this.router.url.includes('edit' )) return; // si en el if no incluye el edit, return;
    // hay que poner su data
    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.heroesService.getHeroById( id ) ),
      ).subscribe( hero => {
          //si no existe el héroe, voy a sacar a la persona de esta pantalla
          if ( !hero ) {
            return this.router.navigateByUrl('/');
          }
          //si existe
          this.heroForm.reset( hero );
          return;
      })
  }

  //creamos un método onSubmit
  onSubmit(): void {
    if ( this.heroForm.invalid) return; //si el formulario no es válido no hagas nada
    // this. heroesService.updateHero(this.heroForm.value);
    // si tenemos un id
    if ( this.currentHero.id ) {
      this.heroesService.updateHero( this.currentHero )
        .subscribe( hero => {
          this.showSnackbar(`${ hero.superhero} updated!`);
        });
        return;
    }
    //si no tenemos un id es que lo quiere crear
    this.heroesService.addHero(this.currentHero)
      .subscribe(hero => {
          //TODO: mostrar snackbar, y navegar a /heroes/edit/ hero.id
        this.router.navigate(['/heroes/edit', hero.id]);
        this.showSnackbar(`${ hero.superhero} created!`);

      });
    }

    //creamos método para llamar el dialogo
    onDeleteHero() {
      if ( !this.currentHero.id ) throw Error('Hero id is required');//si no existe lanzo un Error

      const dialogRef = this.dialog.open( ConfirmDialogComponent, {
        data: this.heroForm.value
      });


      dialogRef.afterClosed()
      .pipe(
        filter( (result: boolean) => result ),
        switchMap( () => this.heroesService.deleteHeroById( this.currentHero.id )),
        filter( (wasDeleted: boolean) => wasDeleted ),
      )
      .subscribe(() => {
        this.router.navigate(['/heroes']);
      });

    // dialogRef.afterClosed().subscribe(result => {
    //   if ( !result ) return;

    //   this.heroesService.deleteHeroById( this.currentHero.id )
    //   .subscribe( wasDeleted => {
    //     if ( wasDeleted )
    //       this.router.navigate(['/heroes']);
    //   })
    // });

  }

    //creamos un método showSnackbar
    showSnackbar( message: string ): void {
      this.snackbar.open( message, 'done',
        { duration: 2500,

        }
      )
    }
  }


