import React, { useContext, useEffect, useState } from "react";
import { FlatList, Modal, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FactoryContext } from "../../app/contexts/FactoryContext";
import { Account } from "../../domain/models/Account";
import { AccountType } from "../../domain/enums/AccountType";
import { dbToIconItem } from "../utils/iconDbMapper";
import { IconRenderer } from "./IconRenderer";
import {
    Center, CloseBtn, CloseText, ConfirmBtn, ConfirmRow, ConfirmText, IconWrap, Loading,
    Overlay, SelectedText, Sheet, TabButton, Tabs, TabText, Tile, TileAmount, TileLabel
} from "../../styles/components/TransactionPickerModalStyles";

interface Props {
    visible: boolean;

    onSelect(account: Account): void;

    onClose(): void;

    excludeId?: number | null;
    initialType?: AccountType;
}

export default function AccountPickerModal({
                                               visible,
                                               onSelect,
                                               onClose,
                                               excludeId = null,
                                               initialType = AccountType.Account,
                                           }: Props) {
    const factory = useContext(FactoryContext);
    const repo = factory?.getRepository(Account);

    const [type, setType] = useState<AccountType>(initialType);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [selected, setSelected] = useState<Account | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!visible) {
            return;
        }
        setSelected(null);
        setType(initialType);
    }, [visible, initialType]);

    useEffect(() => {
        if (!visible) {
            return;
        }
        let active = true;
        (async () => {
            setLoading(true);
            let q = repo?.query().select().where("type", { operator: "=", value: type });
            if (excludeId) {
                q = q?.where("id", { operator: "!=", value: excludeId });
            }
            const list = (await q?.executeAsync()) ?? [];
            if (active) {
                setAccounts(list);
            }
            setLoading(false);
        })();
        return () => {
            active = false;
        }
    }, [repo, type, excludeId, visible]);

    const { height } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <Overlay>
                <Sheet style={{ maxHeight: height * 0.75, paddingBottom: insets.bottom + 8 }}>
                    <Tabs>
                        <TabButton
                            $active={type === AccountType.Account}
                            onPress={() => setType(AccountType.Account)}
                        >
                            <TabText $active={type === AccountType.Account}>Рахунки</TabText>
                        </TabButton>
                        <TabButton
                            $active={type === AccountType.Saving}
                            onPress={() => setType(AccountType.Saving)}
                        >
                            <TabText $active={type === AccountType.Saving}>Банки</TabText>
                        </TabButton>
                        <CloseBtn onPress={onClose}>
                            <CloseText>✕</CloseText>
                        </CloseBtn>
                    </Tabs>

                    {loading ? (
                        <Center>
                            <Loading size="large"/>
                        </Center>
                    ) : (
                        <FlatList
                            data={accounts}
                            keyExtractor={item => item.id?.toString() ?? ""}
                            renderItem={({ item }) => (
                                <Tile
                                    $selected={selected?.id === item.id}
                                    onPress={() => setSelected(item)}
                                    android_ripple={{ color: "#0002", borderless: false }}
                                >
                                    <IconWrap $bgColor={item.color ?? "#999"}>
                                        <IconRenderer icon={dbToIconItem(item.icon)} size={26} color="#fff"/>
                                    </IconWrap>
                                    <TileLabel numberOfLines={1}>{item.name}</TileLabel>
                                    <TileAmount>
                                        {item.currentAmount} {item.currencyCode}
                                    </TileAmount>
                                </Tile>
                            )}
                            contentContainerStyle={{ paddingBottom: 16, paddingTop: 4 }}
                        />
                    )}

                    <ConfirmRow>
                        <SelectedText numberOfLines={1}>
                            {selected ? selected.name : "Виберіть рахунок"}
                        </SelectedText>
                        <ConfirmBtn
                            onPress={() => {
                                if (selected) {
                                    onSelect(selected);
                                    onClose();
                                }
                            }}
                            disabled={!selected}
                            style={{ opacity: selected ? 1 : 0.4 }}
                        >
                            <ConfirmText>Ок</ConfirmText>
                        </ConfirmBtn>
                    </ConfirmRow>
                </Sheet>
            </Overlay>
        </Modal>
    );
}