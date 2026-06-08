import React, { useState, useEffect } from "react";
import { X, Building, Sprout, Wallet, Loader2 } from "lucide-react";

export interface AccountData {
  name: string;
  type: "checking" | "savings" | "wallet";
  balance: number;
  agency?: string;
  accountNumber?: string;
}

export interface ExtendedAccount extends AccountData {
  id: string;
  typeName: string;
  icon: string;
  details: string;
}

interface NewAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (account: AccountData) => void | Promise<void>;
  accountToEdit?: ExtendedAccount | null;
}

export function NewAccountModal({
  isOpen,
  onClose,
  onSave,
  accountToEdit = null,
}: NewAccountModalProps) {
  const [type, setType] = useState<"checking" | "savings" | "wallet">(
    "checking",
  );
  const [name, setName] = useState("");
  const [balanceStr, setBalanceStr] = useState("");
  const [balanceNum, setBalanceNum] = useState(0);
  const [agency, setAgency] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const formatCurrency = (value: string) => {
    if (!value) return { formatted: "", num: 0 };
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return { formatted: "", num: 0 };
    const amount = parseFloat(numbers) / 100;
    return {
      formatted: amount.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      num: amount,
    };
  };

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { formatted, num } = formatCurrency(e.target.value);
    setBalanceStr(formatted);
    setBalanceNum(num);
  };

  const handleAgencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "").slice(0, 4);
    setAgency(onlyNumbers);
  };

  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let numbers = e.target.value.replace(/\D/g, "").slice(0, 10);
    if (numbers.length > 1) {
      numbers = numbers.replace(/(\d+)(\d{1})$/, "$1-$2");
    }
    setAccountNumber(numbers);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (accountToEdit) {
        setType(accountToEdit.type);
        setName(accountToEdit.name);
        setBalanceNum(accountToEdit.balance);
        setBalanceStr(
          accountToEdit.balance.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        );
        setAgency(
          accountToEdit.agency
            ? accountToEdit.agency.replace(/\D/g, "").slice(0, 4)
            : "",
        );

        let accNum = accountToEdit.accountNumber
          ? accountToEdit.accountNumber.replace(/\D/g, "").slice(0, 10)
          : "";
        if (accNum.length > 1)
          accNum = accNum.replace(/(\d+)(\d{1})$/, "$1-$2");
        setAccountNumber(accNum);
      } else {
        handleReset();
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, accountToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave({
          name,
          type,
          balance: balanceNum,
          ...(type !== "wallet" && { agency, accountNumber }),
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setType("checking");
    setName("");
    setBalanceStr("");
    setBalanceNum(0);
    setAgency("");
    setAccountNumber("");
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onWheel={(e) => e.stopPropagation()}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      <div className="relative bg-card text-card-foreground rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border/50 animate-in fade-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-card/80 backdrop-blur-md border-b border-border/50 px-8 py-5 flex items-center justify-between rounded-t-3xl z-10">
          <h2 className="text-xl font-bold tracking-tight">
            {accountToEdit ? "Editar Conta" : "Nova Conta"}
          </h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Tipo de Conta
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setType("checking")}
                className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all ${
                  type === "checking"
                    ? "bg-[#2B5BBA] text-white shadow-lg shadow-blue-500/20 scale-[1.02]"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                <Building size={24} /> Corrente
              </button>
              <button
                type="button"
                onClick={() => setType("savings")}
                className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all ${
                  type === "savings"
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-[1.02]"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                <Sprout size={24} /> Poupança
              </button>
              <button
                type="button"
                onClick={() => setType("wallet")}
                className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all ${
                  type === "wallet"
                    ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20 scale-[1.02]"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                <Wallet size={24} /> Carteira
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nome da Conta
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Itaú Principal"
                className="w-full px-4 py-3.5 bg-muted/50 border border-transparent rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Saldo {accountToEdit ? "Atual" : "Inicial"}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#2B5BBA]">
                  R$
                </span>
                <input
                  type="text"
                  value={balanceStr}
                  onChange={handleBalanceChange}
                  placeholder="0,00"
                  className="w-full pl-12 pr-4 py-3.5 bg-muted/50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all font-semibold text-lg text-foreground placeholder:text-muted-foreground/70"
                  required
                />
              </div>
            </div>
          </div>

          {type !== "wallet" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-muted/30 rounded-2xl border border-border/50">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Agência
                </label>
                <input
                  type="text"
                  value={agency}
                  onChange={handleAgencyChange}
                  placeholder="0000"
                  maxLength={4}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] transition-all font-mono tracking-wider"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Número da Conta
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={handleAccountNumberChange}
                  placeholder="00000-0"
                  maxLength={11}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] transition-all font-mono tracking-wider"
                  required
                />
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-6 border-t border-border/50 mt-8">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3.5 bg-muted text-foreground rounded-xl font-semibold hover:bg-muted/80 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-3.5 rounded-xl font-bold text-white bg-[#2B5BBA] hover:bg-[#1e4594] transition-all shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isSaving && <Loader2 size={18} className="animate-spin" />}
              {isSaving
                ? "Salvando..."
                : accountToEdit
                  ? "Salvar Alterações"
                  : "Criar Conta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
