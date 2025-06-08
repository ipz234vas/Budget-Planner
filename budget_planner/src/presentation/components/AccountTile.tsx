import { Account } from "../../domain/models/Account";
import { FC } from "react";
import { IconWrap, Tile, TileAmount, TileLabel } from "../../styles/components/TransactionPickerModalStyles";
import { IconRenderer } from "./IconRenderer";
import { dbToIconItem } from "../utils/iconDbMapper";

interface AccountTileProps {
    account: Account;
    selected: boolean;

    onPress(): void;
}

export const AccountTile: FC<AccountTileProps> = ({ account, selected, onPress }) => (
    <Tile $selected={selected} onPress={onPress} android_ripple={{ color: "#0002", borderless: false }}>
        <IconWrap $bgColor={account.color ?? "#999"}>
            <IconRenderer icon={dbToIconItem(account.icon)} size={26} color="#fff"/>
        </IconWrap>
        <TileLabel numberOfLines={1}>{account.name}</TileLabel>
        <TileAmount>{account.currentAmount.toFixed(2)} {account.currencyCode}</TileAmount>
    </Tile>
);
