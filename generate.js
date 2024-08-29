const fs = require('fs')
const networks = require('./networks.json')

function configNetworkId(networkId) {
  switch (networkId) {
    case 'arbitrum':
      return 'arbitrum-one'
    case 'blast':
      return 'blast-mainnet'
    case 'polygon':
      return 'matic'
  }

  return networkId
}

function manifestNetworkId(networkId) {
  switch (networkId) {
    case 'arbitrum':
      return 'arbitrum-one'
    case 'polygon':
      return 'matic'
  }

  return networkId
}

const networkId = process.argv[2]
const manifestNetwork = manifestNetworkId(networkId)
const network = networks[configNetworkId(networkId)]
const { address, startBlock } = network.Factory

const manifest = `
specVersion: 0.0.5
description: Uniswap is a decentralized protocol for automated token exchange on Ethereum.
repository: https://github.com/Uniswap/uniswap-v3-subgraph
schema:
  file: ./schema.graphql
features:
  - nonFatalErrors
  - grafting
dataSources:
  - kind: ethereum/contract
    name: Factory
    network: ${manifestNetwork}
    source:
      address: '${address}'
      abi: Factory
      startBlock: ${startBlock}
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.7
      language: wasm/assemblyscript
      file: ./src/mappings/factory.ts
      entities:
        - Pool
        - Token
      abis:
        - name: Factory
          file: ./abis/factory.json
        - name: ERC20
          file: ./abis/ERC20.json
        - name: ERC20SymbolBytes
          file: ./abis/ERC20SymbolBytes.json
        - name: ERC20NameBytes
          file: ./abis/ERC20NameBytes.json
        - name: Pool
          file: ./abis/pool.json
      eventHandlers:
        - event: PoolCreated(indexed address,indexed address,indexed uint24,int24,address)
          handler: handlePoolCreated
templates:
  - kind: ethereum/contract
    name: Pool
    network: ${manifestNetwork}
    source:
      abi: Pool
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.7
      language: wasm/assemblyscript
      file: ./src/mappings/pool/index.ts
      entities:
        - Pool
        - Token
      abis:
        - name: Pool
          file: ./abis/pool.json
        - name: Factory
          file: ./abis/factory.json
        - name: ERC20
          file: ./abis/ERC20.json
      eventHandlers:
        - event: Initialize(uint160,int24)
          handler: handleInitialize
        - event: Swap(indexed address,indexed address,int256,int256,uint160,uint128,int24)
          handler: handleSwap
`.trimStart()

fs.writeFileSync('subgraph.yaml', manifest)
