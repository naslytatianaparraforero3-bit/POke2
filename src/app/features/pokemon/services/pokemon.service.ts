import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Pokemon, PokemonListResponse } from '../model/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly API_URL = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {}

  getPokemonList(offset: number = 0, limit: number = 20): Observable<Pokemon[]> {
    return this.http.get<PokemonListResponse>(`${this.API_URL}?offset=${offset}&limit=${limit}`).pipe(
      switchMap((response) => {
        const pokemonRequests = response.results.map((item) =>
          this.http.get<Pokemon>(item.url)
        );
        return forkJoin(pokemonRequests);
      }),
      map((pokemons) => pokemons)
    );
  }
}

// p <3 // yop  