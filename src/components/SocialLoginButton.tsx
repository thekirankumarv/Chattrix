import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface SocialLoginButtonProps {
    icon: React.ReactNode;
    text: string;
    onPress: () => void;
    buttonStyle?: ViewStyle;
    textStyle?: TextStyle;
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({ icon, text, onPress, buttonStyle, textStyle }) => {
    return (
        <TouchableOpacity style={[styles.button, buttonStyle]} onPress={onPress}>
            {icon}
            <Text style={[styles.btnTxt, textStyle]}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        padding: 10,
        borderColor: 'gray',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        marginBottom: 15
    },
    btnTxt: {
        fontSize: 14,
        fontWeight: '600',
        color: 'black'
    }
});

export default SocialLoginButton;