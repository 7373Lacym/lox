import type  {Token} from "../types/Token";

export type Scanner = {
  __Type: "Scanner",
  tokens :  Token[]
  source : string
  start: number
  current : number
  line : number
}
