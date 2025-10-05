import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import axios, {AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';

import { AxiosAdapter } from 'src/common/adapters/axios.adapters';


@Injectable()
export class SeedService {

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany( {} );

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    //const insertPromiseArray: Promise<any>[] = [];
    const pokemonToInsert: { name: string, no: number }[] = [];

    data.results.forEach(({ name, url })  => {
        const segments = url.split('/');
        const no = +segments[ segments.length - 2];

        //const pokemon = await this.pokemonModel.create({ name, no });
        //this solution create many promises, it's no the best way
        // insertPromiseArray.push(
        //   this.pokemonModel.create({ name, no })
        //)
        pokemonToInsert.push( {name, no });
    })

    //insert into pokemons (name, no);
    await this.pokemonModel.insertMany(pokemonToInsert);
    
    return 'Seed Execute';
  }

}
