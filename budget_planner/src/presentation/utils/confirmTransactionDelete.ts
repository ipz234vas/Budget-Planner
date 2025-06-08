import { Alert } from "react-native";

export function confirmTransactionDelete(
    onDelete: (updateBalance: boolean) => Promise<void>
) {
    Alert.alert(
        "Видалити транзакцію",
        "Ви впевнені, що хочете видалити цю транзакцію?",
        [
            {
                text: "Скасувати",
                style: "cancel",
            },
            {
                text: "Видалити",
                style: "destructive",
                onPress: () => {
                    Alert.alert(
                        "Оновити баланс рахунку?",
                        "Після видалення оновити баланс рахунку?",
                        [
                            {
                                text: "Зберегти баланс",
                                onPress: () => onDelete(false),
                            },
                            {
                                text: "Оновити баланс",
                                style: "default",
                                onPress: () => onDelete(true),
                            },
                        ]
                    );
                },
            },
        ]
    );
}
