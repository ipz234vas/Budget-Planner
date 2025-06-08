import React, { useEffect, useState } from "react";
import { AccountType } from "../../domain/enums/AccountType";
import { Account } from "../../domain/models/Account";
import { FlatList, Modal, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAccountsByType } from "../hooks/accounts/useAccountsByType";
import {
    Center, ConfirmBtn, ConfirmRow, ConfirmText, Loading, Overlay, SelectedText, Sheet
} from "../../styles/components/TransactionPickerModalStyles";
import { AccountTile } from "./AccountTile";
import { AccountPickerTabs } from "./AccountPickerTabs";

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
    const [type, setType] = useState<AccountType>(initialType);
    const [selected, setSelected] = useState<Account | null>(null);
    const { height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const { accounts, loading } = useAccountsByType(type, excludeId, visible);

    useEffect(() => {
        if (visible) {
            setSelected(null);
            setType(initialType);
        }
    }, [visible, initialType]);

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <Overlay>
                <Sheet style={{ maxHeight: height * 0.75, paddingBottom: insets.bottom + 8 }}>
                    <AccountPickerTabs type={type} onChangeType={setType} onClose={onClose}/>

                    {loading ? (
                        <Center><Loading size="large"/></Center>
                    ) : (
                        <FlatList
                            data={accounts}
                            keyExtractor={item => item.id?.toString() ?? ""}
                            renderItem={({ item }) => (
                                <AccountTile
                                    account={item}
                                    selected={selected?.id === item.id}
                                    onPress={() => setSelected(item)}
                                />
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
