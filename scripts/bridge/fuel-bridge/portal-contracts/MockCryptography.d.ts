/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  Contract,
  ContractTransaction,
  CallOverrides,
} from 'ethers';
import { BytesLike } from '@ethersproject/bytes';
import { Listener, Provider } from '@ethersproject/providers';
import { FunctionFragment, EventFragment, Result } from '@ethersproject/abi';
import { TypedEventFilter, TypedEvent, TypedListener } from './commons';

interface MockCryptographyInterface extends ethers.utils.Interface {
  functions: {
    'addressFromSignature(bytes,bytes32)': FunctionFragment;
    'addressFromSignatureComponents(uint8,bytes32,bytes32,bytes32)': FunctionFragment;
    'hash(bytes)': FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: 'addressFromSignature',
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: 'addressFromSignatureComponents',
    values: [BigNumberish, BytesLike, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: 'hash', values: [BytesLike]): string;

  decodeFunctionResult(
    functionFragment: 'addressFromSignature',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'addressFromSignatureComponents',
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: 'hash', data: BytesLike): Result;

  events: {};
}

export class MockCryptography extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: MockCryptographyInterface;

  functions: {
    addressFromSignature(
      signature: BytesLike,
      message: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    'addressFromSignature(bytes,bytes32)'(
      signature: BytesLike,
      message: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    addressFromSignatureComponents(
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      message: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    'addressFromSignatureComponents(uint8,bytes32,bytes32,bytes32)'(
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      message: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    hash(data: BytesLike, overrides?: CallOverrides): Promise<[string]>;

    'hash(bytes)'(
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;
  };

  addressFromSignature(
    signature: BytesLike,
    message: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  'addressFromSignature(bytes,bytes32)'(
    signature: BytesLike,
    message: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  addressFromSignatureComponents(
    v: BigNumberish,
    r: BytesLike,
    s: BytesLike,
    message: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  'addressFromSignatureComponents(uint8,bytes32,bytes32,bytes32)'(
    v: BigNumberish,
    r: BytesLike,
    s: BytesLike,
    message: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  hash(data: BytesLike, overrides?: CallOverrides): Promise<string>;

  'hash(bytes)'(data: BytesLike, overrides?: CallOverrides): Promise<string>;

  callStatic: {
    addressFromSignature(
      signature: BytesLike,
      message: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    'addressFromSignature(bytes,bytes32)'(
      signature: BytesLike,
      message: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    addressFromSignatureComponents(
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      message: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    'addressFromSignatureComponents(uint8,bytes32,bytes32,bytes32)'(
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      message: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    hash(data: BytesLike, overrides?: CallOverrides): Promise<string>;

    'hash(bytes)'(data: BytesLike, overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    addressFromSignature(
      signature: BytesLike,
      message: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    'addressFromSignature(bytes,bytes32)'(
      signature: BytesLike,
      message: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    addressFromSignatureComponents(
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      message: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    'addressFromSignatureComponents(uint8,bytes32,bytes32,bytes32)'(
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      message: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    hash(data: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    'hash(bytes)'(
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addressFromSignature(
      signature: BytesLike,
      message: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    'addressFromSignature(bytes,bytes32)'(
      signature: BytesLike,
      message: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    addressFromSignatureComponents(
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      message: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    'addressFromSignatureComponents(uint8,bytes32,bytes32,bytes32)'(
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      message: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    hash(
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    'hash(bytes)'(
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
