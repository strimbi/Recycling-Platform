import { createPortal } from 'react-dom';

export default function Modal({ open, title, children, onClose }) {
    if (!open) return null;

    // Portal -> scoate modalul din MapContainer, ca Leaflet să nu mai “fure” click-ul pe input-uri
    return createPortal(
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
                zIndex: 9999,
                pointerEvents: 'auto',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: 'min(520px, 100%)',
                    background: 'white',
                    borderRadius: 12,
                    overflow: 'hidden',
                }}
            >
                <div style={{ padding: 12, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 700 }}>{title}</div>
                    <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>✕</button>
                </div>
                <div>{children}</div>
            </div>
        </div>,
        document.body
    );
}
