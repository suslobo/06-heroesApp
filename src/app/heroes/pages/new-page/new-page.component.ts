import { Component } from '@angular/core';
import { FormControl, FormGroup, ValueChangeEvent } from '@angular/forms';
import { Publisher, Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent {

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
  constructor( private heroesService: HeroesService ) {}

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }



  //creamos un método onSubmit
  onSubmit(): void {
    if ( this.heroForm.invalid) return; //si el formulario no es válido no hagas nada
    // this. heroesService.updateHero(this.heroForm.value);
    // si tenemos un id
    if ( this.currentHero.id ) {
      this.heroesService.updateHero( this.currentHero )
        .subscribe( hero => {
            //TODO: mostrar snackbar
        });
        return;
    }
    //si no tenemos un id es que lo quiere crear
    this.heroesService.addHero(this.currentHero)
      .subscribe(hero => {
          //TODO: mostrar snackbar, y navegar a /heroes/edit/ hero.id
      });
    }
  }


