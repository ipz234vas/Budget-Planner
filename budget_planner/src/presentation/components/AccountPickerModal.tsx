import React, { useContext, useEffect, useState } from "react";
import { FlatList, Modal, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FactoryContext } from "../../app/contexts/FactoryContext";
import { Account } from "../../domain/models/Account";
import { AccountType } from "../../domain/enums/AccountType";
import { dbToIconItem } from "../utils/iconDbMapper";
import { IconRenderer } from "./IconRenderer";

interface Props {
    visible: boolean;

    onSelect(account: Account): void;

    onClose(): void;

    excludeId?: number | null; // id який треба пропустити
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
        if (!visible) return;
        setSelected(null);
        setType(initialType);
    }, [visible, initialType]);

    useEffect(() => {
        if (!visible) return;
        let active = true;
        (async () => {
            setLoading(true);
            let q = repo?.query().select().where("type", { operator: "=", value: type });
            if (excludeId) q = q?.where("id", { operator: "!=", value: excludeId });
            const list = (await q?.executeAsync()) ?? [];
            if (active) setAccounts(list);
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

const Overlay = styled.Pressable`
    flex: 1;
    background: rgba(0, 0, 0, 0.37);
    justify-content: flex-end;
`;

const Sheet = styled.View`
    flex: 1;
    background: ${({ theme }) => theme.colors.background};
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    padding: ${({ theme }) => theme.spacing.m}px;
    min-height: 220px;
    elevation: 12;
`;

const Tabs = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 8px;
`;

const TabButton = styled.Pressable<{ $active: boolean }>`
    padding: 8px 18px;
    background: ${({ $active, theme }) => $active ? theme.colors.primary : "transparent"};
    border-radius: ${({ theme }) => theme.borderRadius.s}px;
    margin-right: 8px;
`;

const TabText = styled.Text<{ $active: boolean }>`
    font-weight: 600;
    color: ${({ $active, theme }) => $active ? "#fff" : theme.colors.textPrimary};
    font-size: 16px;
`;

const CloseBtn = styled.Pressable`
    padding: 8px;
    margin-left: auto;
`;
const CloseText = styled.Text`
    font-size: 20px;
    color: ${({ theme }) => theme.colors.textPrimary};
`;

const Tile = styled.Pressable<{ $selected?: boolean }>`
    flex-direction: row;
    align-items: center;
    border-radius: ${({ theme }) => theme.borderRadius.m}px;
    background: ${({ theme, $selected }) => $selected ? theme.colors.primary : theme.colors.secondaryBackground};
    padding: ${({ theme }) => theme.spacing.s + 6}px;
    margin-vertical: 3px;
    margin-horizontal: 0;
    border-width: ${({ $selected }) => ($selected ? "2px" : "0px")};
    border-color: ${({ theme, $selected }) => ($selected ? theme.colors.primary : "transparent")};
`;

const IconWrap = styled.View<{ $bgColor: string }>`
    padding: 10px;
    border-radius: 12px;
    background: ${({ $bgColor }) => $bgColor};
    justify-content: center;
    align-items: center;
`;

const TileLabel = styled.Text`
    flex: 1;
    margin-left: ${({ theme }) => theme.spacing.m}px;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: ${({ theme }) => theme.fontSizes.s + 2}px;
    font-weight: 500;
`;

const TileAmount = styled.Text`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: ${({ theme }) => theme.fontSizes.s}px;
    margin-left: 8px;
    min-width: 70px;
    text-align: right;
`;

const ConfirmRow = styled.View`
    margin-top: 12px;
    margin-bottom: 2px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const SelectedText = styled.Text`
    flex: 1;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-right: ${({ theme }) => theme.spacing.s}px;
`;

const ConfirmBtn = styled.Pressable`
    padding: ${({ theme }) => theme.spacing.s}px ${({ theme }) => theme.spacing.m}px;
    background: ${({ theme }) => theme.colors.positive};
    border-radius: ${({ theme }) => theme.borderRadius.s}px;
`;

const ConfirmText = styled.Text`
    color: #fff;
    font-weight: 600;
`;

const Center = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    min-height: 120px;
`;

const Loading = styled.ActivityIndicator``;
