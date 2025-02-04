import { commands } from '@/bindings';
import { useWalletState } from '@/state';
import { Params, Return } from '../commands';

export async function handleGetNfts(
  params: Params<'chia_getNfts'>,
): Promise<Return<'chia_getNfts'>> {
  const data = await commands.getNfts({
    limit: params.limit ?? 10,
    offset: params.offset ?? 0,
    collection_id: params.collectionId ?? null,
    // TODO: Add sort mode and include hidden to WalletConnect API?
    // Not adding for now to leave it open in the future to decide.
    sort_mode: 'name',
    include_hidden: true,
  });

  return {
    nfts: data.nfts.map((nft) => {
      return {
        name: nft.name,
        launcherId: nft.launcher_id,
        minterDid: nft.minter_did,
        ownerDid: nft.owner_did,
        collectionId: nft.collection_id,
        collectionName: nft.collection_name,
        createdHeight: nft.created_height,
        coinId: nft.coin_id,
        address: nft.address,
        royaltyAddress: nft.royalty_address,
        royaltyTenThousandths: nft.royalty_ten_thousandths,
        dataUris: nft.data_uris,
        dataHash: nft.data_hash,
        metadataUris: nft.metadata_uris,
        metadataHash: nft.metadata_hash,
        licenseUris: nft.license_uris,
        licenseHash: nft.license_hash,
        editionNumber: nft.edition_number,
        editionTotal: nft.edition_total,
      };
    }),
  };
}

export async function handleSend(
  params: Params<'chia_send'>,
): Promise<Return<'chia_send'>> {
  if (params.assetId) {
    await commands.sendCat({
      asset_id: params.assetId,
      address: params.address,
      amount: params.amount,
      fee: params.fee ?? 0,
      memos: params.memos ?? [],
      auto_submit: true,
    });
  } else {
    await commands.sendXch({
      address: params.address,
      amount: params.amount,
      fee: params.fee ?? 0,
      memos: params.memos ?? [],
      auto_submit: true,
    });
  }

  return {};
}

export async function handleGetAddress(
  _params: Params<'chia_getAddress'>,
): Promise<Return<'chia_getAddress'>> {
  return {
    address: useWalletState.getState().sync.receive_address,
  };
}
