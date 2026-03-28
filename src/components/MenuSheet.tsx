import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { Copy, Trash2, Info, User, Send } from "lucide-react"

interface MenuSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onClearData: () => void;
  onExportData: () => void;
}

// Reusable menu row component
function MenuRow({ icon, label, sublabel, onClick, danger = false }: {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '18px',
        background: 'none',
        border: 'none',
        color: danger ? '#ff4c4c' : '#fff',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        padding: '14px 0',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
      className="hover:opacity-60 active:opacity-40 transition-opacity"
    >
      <span style={{ flexShrink: 0 }}>{icon}</span>
      <div>
        <span style={{
          display: 'block',
          fontFamily: 'Inter, sans-serif',
          fontSize: '1rem',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
        }}>
          {label}
        </span>
        {sublabel && (
          <span style={{
            display: 'block',
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            color: danger ? 'rgba(255,90,90,0.55)' : 'rgba(255,255,255,0.35)',
            marginTop: '3px',
            letterSpacing: '0.02em',
          }}>
            {sublabel}
          </span>
        )}
      </div>
    </button>
  );
}

export default function MenuSheet({ isOpen, onClose, onClearData, onExportData }: MenuSheetProps) {
  const handleExport = () => {
    onExportData();
    alert("¡Bitácora copiada al portapapeles!");
  };

  const handleClear = () => {
    if (confirm("¿Estás seguro? Esta acción borrará todos tus favoritos y ranking guardado.")) {
      onClearData();
      onClose();
    }
  };

  const SectionLabel = ({ text }: { text: string }) => (
    <p style={{
      fontFamily: 'Inter, sans-serif',
      fontSize: '9px',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.25em',
      color: 'rgba(255,255,255,0.25)',
      marginBottom: '4px',
      marginTop: '32px',
    }}>
      {text}
    </p>
  );

  return (
    <Drawer open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }} direction="left">
      <DrawerContent
        className="!right-auto !inset-y-0 !mt-0 h-full w-[80vw] max-w-[360px] border-none rounded-none outline-none"
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#1b1b1b',
          color: '#fff',
          padding: 0,
        }}
      >
        <div style={{ flex: 1, overflowY: 'auto', padding: '64px 28px 48px' }}>

          {/* Header */}
          <div style={{ marginBottom: '48px' }}>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '9px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.3)',
              marginBottom: '10px',
            }}>
              La Guía Offline
            </p>
            <h1 style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 900,
              fontSize: '2.2rem',
              lineHeight: 0.9,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              color: '#fff',
              margin: 0,
            }}>
              Bitácora<br />Gastronómica
            </h1>
            <div style={{ width: '32px', height: '2px', backgroundColor: 'rgba(255,255,255,0.3)', marginTop: '20px' }} />
          </div>

          {/* Editorial */}
          <SectionLabel text="Editorial" />
          <MenuRow
            icon={<Info size={18} strokeWidth={1.5} />}
            label="¿Qué es la Bitácora?"
            sublabel="El manifiesto de la curaduría"
            onClick={() => alert("Próximamente: El manifiesto detrás de estos rincones.")}
          />
          <MenuRow
            icon={<User size={18} strokeWidth={1.5} />}
            label="Los Curadores"
            sublabel="Quiénes seleccionan estos lugares"
            onClick={() => alert("Próximamente: Los voces detrás de la guía.")}
          />

          {/* Comunidad */}
          <SectionLabel text="Comunidad" />
          <MenuRow
            icon={<Send size={18} strokeWidth={1.5} />}
            label="Sugerir un Rincón"
            sublabel="Envía un lugar que te encante"
            onClick={() => { window.location.href = "mailto:hola@bitacora.com?subject=Sugerencia%20de%20Rincón"; }}
          />

          {/* Datos */}
          <SectionLabel text="Tus Datos" />
          <MenuRow
            icon={<Copy size={18} strokeWidth={1.5} />}
            label="Exportar Bitácora"
            sublabel="Copia tus listas como JSON"
            onClick={handleExport}
          />
          <MenuRow
            icon={<Trash2 size={18} strokeWidth={1.5} />}
            label="Borrar Datos"
            sublabel="Elimina favoritos y ranking local"
            onClick={handleClear}
            danger
          />

          {/* Version */}
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '9px',
            color: 'rgba(255,255,255,0.15)',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            marginTop: '48px',
          }}>
            v0.1.0 — Caracas, 2025
          </p>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
