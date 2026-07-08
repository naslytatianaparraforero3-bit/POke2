import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { Pokemon, PokemonListResponse, PokemonTypeDetail } from '../model/pokemon.model';

interface PokemonSearchResponse {
  count: number;
  results: { name: string; url: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly API_URL = 'https://pokeapi.co/api/v2/pokemon';
  private readonly TYPE_API_URL = 'https://pokeapi.co/api/v2/type';

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

  searchPokemonByName(name: string): Observable<Pokemon[]> {
    return this.http.get<PokemonSearchResponse>(`${this.API_URL}?limit=1000`).pipe(
      switchMap((response) => {
        const filtered = response.results.filter((item) =>
          item.name.toLowerCase().includes(name.toLowerCase())
        );
        const limited = filtered.slice(0, 20);
        const pokemonRequests = limited.map((item) =>
          this.http.get<Pokemon>(item.url)
        );
        return forkJoin(pokemonRequests);
      }),
      map((pokemons) => pokemons)
    );
  }

  getPokemonTypeDetail(typeUrl: string): Observable<PokemonTypeDetail> {
    return this.http.get<PokemonTypeDetail>(typeUrl);
  }
}
// p <3 // yop  