// src/components/CheckoutForm.tsx

import React from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Feather } from '@expo/vector-icons';
import { Button } from './button';

// Esquema Zod para validação do formulário
const checkoutSchema = z.object({
  customerName: z.string().min(3, "Nome completo precisa de no mínimo 3 caracteres."),
  // CPF com validação mais robusta (aceita com/sem máscara, verifica dígitos) - Opcional, regex simples abaixo
  // customerCpf: z.string().refine(validateCPF, "CPF inválido."),
  customerCpf: z.string().regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$|^\d{11}$/, "CPF inválido (Ex: 123.456.789-00 ou 12345678900)"),
  customerPhone: z.string().regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, "Telefone inválido (Ex: (19) 99999-9999)"),
  customerCep: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido (Ex: 13000-000 ou 13000000)"),
});

// Tipagem dos dados do formulário
export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Props do componente
type CheckoutFormProps = {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: CheckoutFormData) => Promise<void>; // Submit assíncrono
  isSubmitting: boolean;
};

export function CheckoutForm({ isVisible, onClose, onSubmit, isSubmitting }: CheckoutFormProps) {
  const { control, handleSubmit, formState: { errors }, reset } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
        customerName: '',
        customerCpf: '',
        customerPhone: '',
        customerCep: '',
    }
  });

  // Função intermediária para chamar onSubmit e tratar erros localmente se necessário
  const triggerSubmit = async (data: CheckoutFormData) => {
    try {
      await onSubmit(data);
      // O fechamento e reset podem ser feitos aqui ou no cart.tsx após sucesso
      // reset(); // Limpa o formulário
      // onClose();
    } catch (error) {
       console.error("Erro no submit do formulário (CheckoutForm):", error);
       // Exibe um alerta genérico, o tratamento mais específico fica no cart.tsx
       Alert.alert("Erro", "Não foi possível processar o pedido. Verifique os dados.");
    }
  };

  // Resetar o formulário quando o modal for fechado (opcional)
  const handleClose = () => {
    reset();
    onClose();
  }

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        {/* Usar ScrollView para evitar que o teclado cubra os inputs em telas menores */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.modalContainer} className="bg-cinza-100 p-6 rounded-lg w-11/12">
            {/* Cabeçalho */}
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-textoBase text-xl font-heading">Dados para Entrega</Text>
                <TouchableOpacity onPress={handleClose} className="p-1">
                <Feather name="x" size={24} color="#0F172A" />
                </TouchableOpacity>
            </View>

            {/* Nome */}
            <Controller
                control={control}
                name="customerName"
                render={({ field: { onChange, onBlur, value } }) => (
                <View className="mb-3">
                    <Text className="text-textoBase font-subtitle mb-1">Nome Completo</Text>
                    <TextInput
                    className={`bg-white border ${errors.customerName ? 'border-red-500' : 'border-cinza-200'} rounded-md p-3 font-body text-sm text-textoBase`}
                    placeholder="Seu nome completo"
                    placeholderTextColor="#64748B"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="words"
                    />
                    {errors.customerName && <Text style={styles.errorText}>{errors.customerName.message}</Text>}
                </View>
                )}
            />

            {/* CPF */}
            <Controller
                control={control}
                name="customerCpf"
                render={({ field: { onChange, onBlur, value } }) => (
                <View className="mb-3">
                    <Text className="text-textoBase font-subtitle mb-1">CPF</Text>
                    <TextInput
                    className={`bg-white border ${errors.customerCpf ? 'border-red-500' : 'border-cinza-200'} rounded-md p-3 font-body text-sm text-textoBase`}
                    placeholder="000.000.000-00"
                    placeholderTextColor="#64748B"
                    onBlur={onBlur}
                    onChangeText={onChange} // Considere usar uma biblioteca de máscara (ex: react-native-mask-input)
                    value={value}
                    keyboardType="numeric"
                    maxLength={14} // Com máscara
                    />
                    {errors.customerCpf && <Text style={styles.errorText}>{errors.customerCpf.message}</Text>}
                </View>
                )}
            />

            {/* Telefone */}
            <Controller
                control={control}
                name="customerPhone"
                render={({ field: { onChange, onBlur, value } }) => (
                <View className="mb-3">
                    <Text className="text-textoBase font-subtitle mb-1">Telefone / Celular</Text>
                    <TextInput
                    className={`bg-white border ${errors.customerPhone ? 'border-red-500' : 'border-cinza-200'} rounded-md p-3 font-body text-sm text-textoBase`}
                    placeholder="(XX) XXXXX-XXXX"
                    placeholderTextColor="#64748B"
                    onBlur={onBlur}
                    onChangeText={onChange} // Considere usar uma biblioteca de máscara
                    value={value}
                    keyboardType="phone-pad"
                    maxLength={15} // Com máscara
                    />
                    {errors.customerPhone && <Text style={styles.errorText}>{errors.customerPhone.message}</Text>}
                </View>
                )}
            />

            {/* CEP */}
            <Controller
                control={control}
                name="customerCep"
                render={({ field: { onChange, onBlur, value } }) => (
                <View className="mb-4">
                    <Text className="text-textoBase font-subtitle mb-1">CEP</Text>
                    <TextInput
                    className={`bg-white border ${errors.customerCep ? 'border-red-500' : 'border-cinza-200'} rounded-md p-3 font-body text-sm text-textoBase`}
                    placeholder="00000-000"
                    placeholderTextColor="#64748B"
                    onBlur={onBlur}
                    onChangeText={onChange} // Considere usar uma biblioteca de máscara
                    value={value}
                    keyboardType="numeric"
                    maxLength={9} // Com máscara
                    />
                    {errors.customerCep && <Text style={styles.errorText}>{errors.customerCep.message}</Text>}
                </View>
                )}
            />

            {/* Botão de Envio */}
            <Button onPress={handleSubmit(triggerSubmit)} disabled={isSubmitting}>
                {isSubmitting ? (
                    <ActivityIndicator color="#FFF" />
                ) : (
                    <>
                        <Button.Icon>
                            <Feather name="check-circle" size={20} />
                        </Button.Icon>
                        <Button.Text>Confirmar Pedido</Button.Text>
                    </>
                )}
            </Button>

            </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

// Estilos
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  // Estilo para permitir scroll se o conteúdo for maior que a tela
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalContainer: {
    // maxHeight: '90%', // Limitador de altura
    width: '90%', // Largura do modal
  },
  errorText: {
      color: '#EF4444', // Cor vermelha (red-500)
      fontSize: 12,
      marginTop: 4,
  }
});

// Função de validação de CPF (exemplo, pode precisar de ajustes ou biblioteca)
// function validateCPF(cpf: string): boolean {
//   cpf = cpf.replace(/[^\d]+/g,'');
//   if(cpf == '') return false;
//   // Elimina CPFs invalidos conhecidos
//   if (cpf.length != 11 || /^(\d)\1{10}$/.test(cpf)) return false;
//   // Valida DVs
//   let add = 0;
//   for (let i=0; i < 9; i ++) add += parseInt(cpf.charAt(i)) * (10 - i);
//   let rev = 11 - (add % 11);
//   if (rev == 10 || rev == 11) rev = 0;
//   if (rev != parseInt(cpf.charAt(9))) return false;
//   add = 0;
//   for (let i = 0; i < 10; i ++) add += parseInt(cpf.charAt(i)) * (11 - i);
//   rev = 11 - (add % 11);
//   if (rev == 10 || rev == 11) rev = 0;
//   if (rev != parseInt(cpf.charAt(10))) return false;
//   return true;
// }