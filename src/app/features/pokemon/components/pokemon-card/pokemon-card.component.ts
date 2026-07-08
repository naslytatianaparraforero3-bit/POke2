import { Component, Input, Output, EventEmitter } from '@angular/core'; 
import { Pokemon, PokemonStat } from '../../model/pokemon.model';

@Component({
  selector: 'app-pokemon-card',
  standalone: false,
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss']
})
export class PokemonCardComponent {
  @Input() pokemon!: Pokemon;

  @Output() typeClick = new EventEmitter<string>();

  getMainType(): string {
    return this.pokemon.types[0]?.type.name || 'normal';
  }

  getStatValue(statName: string): number {
    const stat = this.pokemon.stats.find((s: PokemonStat) => s.stat.name === statName);
    return stat ? stat.base_stat : 0;
  }

  onTypeClick(typeUrl: string): void {
    this.typeClick.emit(typeUrl);
  }
}