import Promise from 'bluebird'
import {RuntimeState} from "../../../src/Framework/States";
import {State} from "../../../src/Framework/States/State";
import {Uninitialized} from "../../../src/Framework/States";

export class InitializeCompleteMock extends State implements RuntimeState{

  constructor(){
    super()
    this.canTransitionFrom = [
      InitializeMock
    ]
  }

  run(mutableState: any): Promise<RuntimeState>{
    return Promise.try(() => {
      this.complete = true
      return this
    })
  }
}

export class InitializeMock extends State implements RuntimeState{

  constructor(){
    super()
    this.canTransitionFrom = [
      Uninitialized
    ]
  }

  run(mutableState: any): Promise<RuntimeState>{
    return Promise.try(() => {
      mutableState.hasChanged = true
      this.complete = true
      return new InitializeCompleteMock()
    })
  }
}

export class UninitializedChain extends State implements RuntimeState{
  constructor(){
    super()
  }

  run(mutableState: any): Promise<RuntimeState>{
    return Promise.try(() => {
      this.complete = true
      mutableState.UninitializedChain = true
      return new Chain1()
    })
  }
}

export class Chain1 extends State implements RuntimeState{
  constructor(){
    super()
    this.canTransitionFrom = [
      UninitializedChain
    ]
  }

  run(mutableState: any): Promise<RuntimeState>{
    return Promise.try(() => {
      this.complete = true
      mutableState.Chain1 = true
      return new Chain2()
    })
  }
}

class Chain2 extends State implements RuntimeState{
  constructor(){
    super()
    this.canTransitionFrom = [
      Chain1
    ]
  }

  run(mutableState: any): Promise<RuntimeState>{
    return Promise.try(() => {
      this.complete = true
      mutableState.Chain2 = true
      return new Chain3()
    })
  }
}

class Chain3 extends State implements RuntimeState{
  constructor(){
    super()
    this.canTransitionFrom = [
      Chain2
    ]
  }

  run(mutableState: any): Promise<RuntimeState>{
    return Promise.try(() => {
      this.complete = true
      mutableState.Chain3 = true
      return this
    })
  }
}