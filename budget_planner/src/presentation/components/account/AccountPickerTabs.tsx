import { CloseBtn, CloseText, TabButton, Tabs, TabText } from "../../../styles/components/transaction/TransactionPickerModalStyles";
import { AccountType } from "../../../domain/enums/AccountType";

export const AccountPickerTabs = ({ type, onChangeType, onClose }:
                               {
                                   type: AccountType,
                                   onChangeType: (type: AccountType) => void,
                                   onClose: () => void
                               }) => (
    <Tabs>
        <TabButton $active={type === AccountType.Account} onPress={() => onChangeType(AccountType.Account)}>
            <TabText $active={type === AccountType.Account}>Рахунки</TabText>
        </TabButton>
        <TabButton $active={type === AccountType.Saving} onPress={() => onChangeType(AccountType.Saving)}>
            <TabText $active={type === AccountType.Saving}>Банки</TabText>
        </TabButton>
        <CloseBtn onPress={onClose}>
            <CloseText>✕</CloseText>
        </CloseBtn>
    </Tabs>
);
