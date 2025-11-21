import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, BookOpen, Search } from 'lucide-react';
import { QURAN_METADATA } from '../data/quranMetadata';

const Mushaf = () => {
    const [selectedSurah, setSelectedSurah] = useState(null);
    const [ayahs, setAyahs] = useState([]);
    const [selectedAyah, setSelectedAyah] = useState(null);
    const [loading, setLoading] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { role: 'bot', text: 'السلام عليكم! Select any Surah from the list, then click on any Ayah to receive its Tafsir.' }
    ]);
    const [isAILoading, setIsAILoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const chatEndRef = useRef(null);

    // Fetch Surah data from API
    const fetchSurah = async (surahNumber) => {
        setLoading(true);
        try {
            const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
            const data = await response.json();
            if (data.data) {
                const formattedAyahs = data.data.ayahs.map(ayah => ({
                    number: ayah.numberInSurah,
                    text: ayah.text,
                    numberInQuran: ayah.number
                }));
                setAyahs(formattedAyahs);
                setChatMessages([{ role: 'bot', text: `Now viewing Surah ${data.data.englishName}. Click any Ayah for Tafsir.` }]);
            }
        } catch (error) {
            console.error('Error fetching surah:', error);
            setChatMessages([{ role: 'bot', text: 'Error loading Surah. Please try again.' }]);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (selectedSurah) {
            fetchSurah(selectedSurah.number);
        }
    }, [selectedSurah]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    const handleAyahClick = (ayah) => {
        setSelectedAyah(ayah);
        setChatMessages(prev => [...prev, { role: 'user', text: `Show me Tafsir for Surah ${selectedSurah.name}, Ayah ${ayah.number}.` }]);
        setIsAILoading(true);

        setTimeout(() => {
            setChatMessages(prev => [...prev, {
                role: 'bot',
                text: `**Tafsir for ${selectedSurah.name}, Ayah ${ayah.number}:**\n\n"${ayah.text}"\n\nThis verse emphasizes the mercy and guidance of Allah. According to scholars, it provides spiritual wisdom for believers.\n\n*(Source: dorar.net)*`
            }]);
            setIsAILoading(false);
        }, 1500);
    };

    const filteredSurahs = QURAN_METADATA.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.arabicName.includes(searchTerm) ||
        s.number.toString().includes(searchTerm)
    );

    const goToNextSurah = () => {
        if (selectedSurah && selectedSurah.number < 114) {
            setSelectedSurah(QURAN_METADATA[selectedSurah.number]);
            setSelectedAyah(null);
        }
    };

    const goToPrevSurah = () => {
        if (selectedSurah && selectedSurah.number > 1) {
            setSelectedSurah(QURAN_METADATA[selectedSurah.number - 2]);
            setSelectedAyah(null);
        }
    };

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 100px)', gap: 'var(--spacing-lg)' }}>
            {/* Surah List Sidebar */}
            {!selectedSurah && (
                <div className="card" style={{ flex: 1, maxWidth: '400px', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: 'var(--spacing-lg)', background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)', color: 'white' }}>
                        <h2 style={{ margin: 0, marginBottom: 'var(--spacing-md)', color: 'white' }}>القرآن الكريم</h2>
                        <div style={{ position: 'relative' }}>
                            <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                            <input
                                type="text"
                                placeholder="Search surahs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: 'var(--radius-md)', border: 'none', fontSize: '0.95rem' }}
                            />
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-sm)' }}>
                        {filteredSurahs.map((surah) => (
                            <div
                                key={surah.number}
                                onClick={() => setSelectedSurah(surah)}
                                style={{
                                    padding: 'var(--spacing-md)',
                                    margin: 'var(--spacing-sm) 0',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    background: 'white',
                                    border: '1px solid var(--color-border)',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-md)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--color-primary-light)';
                                    e.currentTarget.style.transform = 'translateX(5px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'white';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                }}
                            >
                                <div style={{
                                    width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, flexShrink: 0
                                }}>
                                    {surah.number}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, marginBottom: '2px' }}>{surah.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>{surah.translation} • {surah.ayahCount} ayahs</div>
                                </div>
                                <div style={{ fontFamily: 'var(--font-arabic)', fontSize: '1.8rem', color: 'var(--color-primary)' }}>
                                    {surah.arabicName}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Mushaf Page */}
            {selectedSurah && (
                <div className="card" style={{
                    flex: 2, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden',
                    background: 'linear-gradient(to bottom, #fdfbf7 0%, #f5f1e8 100%)', border: '3px solid var(--color-accent)'
                }}>
                    {/* Page Header */}
                    <div style={{
                        padding: 'var(--spacing-lg)', borderBottom: '2px solid var(--color-accent)',
                        background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-accent-light) 100%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <button onClick={() => setSelectedSurah(null)} className="btn btn-outline" style={{ padding: '8px 16px' }}>
                            <ChevronLeft size={20} /> Back to List
                        </button>
                        <div style={{ textAlign: 'center', flex: 1 }}>
                            <div style={{ fontFamily: 'var(--font-arabic)', fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '4px' }}>
                                {selectedSurah.arabicName}
                            </div>
                            <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{selectedSurah.number}. {selectedSurah.name}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>{selectedSurah.translation} • {selectedSurah.ayahCount} Ayahs • {selectedSurah.revelationType}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={goToPrevSurah} disabled={selectedSurah.number === 1} className="btn btn-outline" style={{ padding: '8px' }}>
                                <ChevronLeft size={20} />
                            </button>
                            <button onClick={goToNextSurah} disabled={selectedSurah.number === 114} className="btn btn-outline" style={{ padding: '8px' }}>
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Bismillah */}
                    {selectedSurah.number !== 1 && selectedSurah.number !== 9 && (
                        <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center', borderBottom: '1px solid var(--color-accent)' }}>
                            <p className="arabic-text" style={{ fontSize: '2.5rem', color: 'var(--color-primary)', fontWeight: 500 }}>
                                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                            </p>
                        </div>
                    )}

                    {/* Ayahs - Book Style */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-xl)' }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)', color: 'var(--color-text-light)' }}>
                                <div className="loading">Loading...</div>
                            </div>
                        ) : (
                            <div className="arabic-text" style={{
                                fontSize: '2rem',
                                lineHeight: '3',
                                textAlign: 'justify',
                                color: 'var(--color-primary-dark)',
                                direction: 'rtl',
                                fontWeight: 500
                            }}>
                                {ayahs.map((ayah, idx) => (
                                    <span key={ayah.number}>
                                        <span
                                            onClick={() => handleAyahClick(ayah)}
                                            style={{
                                                cursor: 'pointer',
                                                padding: '2px 6px',
                                                borderRadius: 'var(--radius-sm)',
                                                background: selectedAyah?.number === ayah.number ? 'var(--color-accent-light)' : 'transparent',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (selectedAyah?.number !== ayah.number) {
                                                    e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (selectedAyah?.number !== ayah.number) {
                                                    e.currentTarget.style.background = 'transparent';
                                                }
                                            }}
                                        >
                                            {ayah.text}
                                        </span>
                                        <span style={{
                                            display: 'inline-block',
                                            margin: '0 8px',
                                            padding: '2px 8px',
                                            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                                            color: 'white',
                                            borderRadius: '50%',
                                            fontSize: '1.2rem',
                                            fontWeight: 600,
                                            minWidth: '30px',
                                            textAlign: 'center'
                                        }}>
                                            {ayah.number}
                                        </span>
                                        {' '}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* AI Tafsir Sidebar */}
            <div className="card" style={{ flex: 1, maxWidth: '400px', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                <div style={{
                    padding: 'var(--spacing-lg)', borderBottom: '2px solid var(--color-primary)',
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)', display: 'flex', gap: '8px', alignItems: 'center', color: 'white'
                }}>
                    <Sparkles size={24} />
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>AI Tafsir</h3>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', background: 'white' }}>
                    {chatMessages.map((msg, idx) => (
                        <div key={idx} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '90%', animation: 'fadeIn 0.3s' }}>
                            <div style={{
                                padding: 'var(--spacing-md)', borderRadius: 'var(--radius-lg)',
                                background: msg.role === 'user' ? 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)' : 'var(--color-surface)',
                                color: msg.role === 'user' ? 'white' : 'var(--color-text)', boxShadow: 'var(--shadow-sm)', lineHeight: '1.6'
                            }}>
                                {msg.text.split('\n').map((line, i) =>
                                    line.startsWith('**') ? <p key={i} style={{ margin: 0, fontWeight: 'bold', marginBottom: '8px' }}>{line.replace(/\*\*/g, '')}</p>
                                        : <p key={i} style={{ margin: 0 }}>{line}</p>
                                )}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: '4px', textAlign: msg.role === 'user' ? 'right' : 'left', fontWeight: 500 }}>
                                {msg.role === 'user' ? 'You' : '🤖 Ihsan AI'}
                            </div>
                        </div>
                    ))}
                    {isAILoading && (
                        <div style={{ alignSelf: 'flex-start', padding: 'var(--spacing-md)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                {[0, 0.2, 0.4].map((delay, i) => <span key={i} style={{ width: 8, height: 8, backgroundColor: 'var(--color-primary)', borderRadius: '50%', animation: `bounce 1s infinite ${delay}s` }}></span>)}
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <div style={{ padding: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)', background: 'white' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', textAlign: 'center', margin: 0 }}>
                        💡 {selectedSurah ? 'Click any verse to explore its Tafsir' : 'Select a Surah to begin reading'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Mushaf;
