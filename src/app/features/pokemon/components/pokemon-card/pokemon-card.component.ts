import { Component, Input } from '@angular/core';
import { Pokemon } from '../../model/pokemon.model';

@Component({
  selector: 'app-pokemon-card',
   standalone: false,
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss']
})
export class PokemonCardComponent {
  @Input() pokemon!: Pokemon;

  getMainType(): string {
    return this.pokemon.types[0]?.type.name || 'normal';
  }

  getStatValue(statName: string): number {
    const stat = this.pokemon.stats.find(s => s.stat.name === statName);
    return stat ? stat.base_stat : 0;
  }
}

// lop