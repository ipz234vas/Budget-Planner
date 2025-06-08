import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "styled-components/native";
import TransactionsScreen from "../../../presentation/screens/transaction/TransactionsScreen";
import TransactionEditorScreen from "../../../presentation/screens/transaction/TransactionEditorScreen";


export default function TransactionsStack() {
    const Stack = createNativeStackNavigator();
    const theme = useTheme();
    return (
        <Stack.Navigator
            initialRouteName="Transactions"
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: theme.colors.background }
            }}
        >
            <Stack.Screen name="Transactions" component={TransactionsScreen}/>
            <Stack.Screen name="TransactionEditor" component={TransactionEditorScreen}/>
        </Stack.Navigator>
    );
}