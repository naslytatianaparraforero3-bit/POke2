import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Subscription } from 'rxjs';

import { Pokemon, PokemonTypeDetail } from '../../model/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-list',
  standalone: false,
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit, OnDestroy {
  pokemons: Pokemon[] = [];
  loading = false;
  error: string | null = null;
  offset = 0;
  limit = 20;

  searchControl = new FormControl('');
  isSearchMode = false;

  selectedType: PokemonTypeDetail | null = null;
  typeLoading = false;
  showTypeDetail = false;

  private subscription: Subscription = new Subscription();

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadPokemons();
    this.setupSearch();
  }

  setupSearch(): void {
    const searchSub = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) => {
        this.loading = true;
        this.error = null;

        if (!term || term.trim() === '') {
          this.isSearchMode = false;
          return this.pokemonService.getPokemonList(this.offset, this.limit);
        }

        this.isSearchMode = true;
        return this.pokemonService.searchPokemonByName(term);
      })
    ).subscribe({
      next: (data) => {
        this.pokemons = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Error al cargar los Pokémon';
        this.loading = false;
      }
    });

    this.subscription.add(searchSub);
  }

  loadPokemons(): void {
    this.loading = true;
    this.error = null;
    this.isSearchMode = false;
    this.searchControl.setValue('');

    const listSub = this.pokemonService.getPokemonList(this.offset, this.limit).subscribe({
      next: (data) => {
        this.pokemons = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Error al cargar los Pokémon';
        this.loading = false;
      }
    });

    this.subscription.add(listSub);
  }

  nextPage(): void {
    if (!this.isSearchMode) {
      this.offset += this.limit;
      this.loadPokemons();
    }
  }

  previousPage(): void {
    if (!this.isSearchMode && this.offset >= this.limit) {
      this.offset -= this.limit;
      this.loadPokemons();
    }
  }

  showTypeDetailModal(typeUrl: string): void {
    this.typeLoading = true;
    this.showTypeDetail = true;

    const typeSub = this.pokemonService.getPokemonTypeDetail(typeUrl).subscribe({
      next: (data) => {
        this.selectedType = data;
        this.typeLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Error al cargar el tipo';
        this.typeLoading = false;
      }
    });

    this.subscription.add(typeSub);
  }

  closeTypeDetail(): void {
    this.showTypeDetail = false;
    this.selectedType = null;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}