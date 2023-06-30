import { expect, test } from 'vitest'

import {
  wagmiContractConfig,
} from '../../_test/abis.js'
import {
  forkBlockNumber
} from '../../_test/constants.js'
import { publicClient } from '../../_test/utils.js'

import { multicall } from './multicall.js'

test('multicall with inline contracts', async () => {
  expect(
    await multicall(publicClient, {
      allowFailure: false,
      blockNumber: forkBlockNumber,
      contracts: [
        {
          ...wagmiContractConfig,
          functionName: 'ownerOf',
          args: [1n]
        },
        {
          ...wagmiContractConfig,
          functionName: 'ownerOf',
          args: [2n]
        },
      ],
    }),
  ).toMatchInlineSnapshot(`
    [
      "0x1a1E021A302C237453D3D45c7B82B19cEEB7E2e6",
      "0x8eD5C93a4ABb6497D8dD15c61b51eA8aEe2eE4Cb",
    ]
  `)
})

test('multicall with dynamic contracts', async () => {
  const result = await dynamicMulticall('ownerOf', [0n, 1n]) // Type of result unknown[]
  expect(result
  ).toMatchInlineSnapshot(`
    [
      "0x1a1E021A302C237453D3D45c7B82B19cEEB7E2e6",
      "0x1a1E021A302C237453D3D45c7B82B19cEEB7E2e6",
    ]
  `)
})

async function dynamicMulticall(functionName: string, owners: bigint[]) {
  const contracts = owners.map(owner => (
    {
      ...wagmiContractConfig,
      functionName,
      args: [owner]
    } as const)
  )
    return multicall(publicClient, {
    allowFailure: false,
    blockNumber: forkBlockNumber,
    contracts
  })
}


test('multicall with dynamic contracts', async () => {
  const result = await typedDynamicMulticall('ownerOf', [0n, 1n]) // Type of result `0x${string}`[]
  expect(result
  ).toMatchInlineSnapshot(`
    [
      "0x1a1E021A302C237453D3D45c7B82B19cEEB7E2e6",
      "0x1a1E021A302C237453D3D45c7B82B19cEEB7E2e6",
    ]
  `)
})

async function typedDynamicMulticall<TFunctionName extends string>(functionName: TFunctionName, owners: bigint[]) {
  const contracts = owners.map(owner => (
    {
      ...wagmiContractConfig,
      functionName,
      args: [owner]
    } as const) //Note that if we remove this as const TS will compile but the result type won't be inferred
  )
  return multicall(publicClient, {
    allowFailure: false,
    blockNumber: forkBlockNumber,
    // @ts-ignore
    contracts // TS error here!
  })
}
