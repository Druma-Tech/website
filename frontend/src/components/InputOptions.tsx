import React, { useRef, useState, useEffect } from 'react';

const VideoStreamCapture: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImages, setCapturedImages] = useState<string[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    const startStream = async () => {
        try {
            setError(null);
            const constraints = {
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user',
                    frameRate: { ideal: 30 }
                },
                audio: false
            };

            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.play();
                setIsStreaming(true);
            }
        } catch (err) {
            setError('Failed to access camera. Please ensure you have granted camera permissions.');
            console.error('Error accessing camera:', err);
        }
    };

    const stopStream = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
            setIsStreaming(false);
        }
    };

    const captureFrame = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Flip the context horizontally
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);

        // Draw the current video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Reset the transform
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // Convert to blob and create URL
        const blob = await new Promise<Blob | null>((resolve) => 
            canvas.toBlob(resolve, 'image/jpeg', 0.95)
        );

        if (blob) {
            const imgURL = URL.createObjectURL(blob);
            setCapturedImages(prev => [...prev, imgURL]);
        }
    };

    const clearFrames = () => {
        capturedImages.forEach(url => URL.revokeObjectURL(url));
        setCapturedImages([]);
    };

    return (
        <div style={styles.streamContainer}>
            <div style={styles.videoWrapper}>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={styles.video}
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>

            {error && (
                <div style={styles.errorMessage}>
                    {error}
                </div>
            )}

            <div style={styles.controls}>
                {!isStreaming ? (
                    <button 
                        style={styles.controlButton}
                        onClick={startStream}
                    >
                        Start Camera
                    </button>
                ) : (
                    <>
                        <button 
                            style={styles.controlButton}
                            onClick={captureFrame}
                        >
                            Capture Image
                        </button>
                        <button 
                            style={styles.controlButton}
                            onClick={stopStream}
                        >
                            Stop Camera
                        </button>
                    </>
                )}
                {capturedImages.length > 0 && (
                    <button 
                        style={styles.controlButton}
                        onClick={clearFrames}
                    >
                        Clear Images
                    </button>
                )}
            </div>

            {capturedImages.length > 0 && (
                <div style={styles.gallery}>
                    <h3 style={styles.galleryTitle}>Captured Images</h3>
                    <div style={styles.imageGrid}>
                        {capturedImages.map((image, index) => (
                            <div key={index} style={styles.imageWrapper}>
                                <img 
                                    src={image} 
                                    alt={`Captured ${index + 1}`}
                                    style={styles.capturedImage}
                                />
                                <span style={styles.imageLabel}>Image {index + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const FileUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
        }
    };

    const uploadFile = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('api_name', 'file_analysis');
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5000/api/auth/api3', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div style={styles.card}>
            <h2 style={styles.title}>Upload a File</h2>
            <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                style={styles.fileInput}
            />
            {previewUrl && (
                <div style={styles.previewContainer}>
                    <img 
                        src={previewUrl} 
                        alt="Preview" 
                        style={styles.previewImage}
                    />
                </div>
            )}
            <button style={styles.button} onClick={uploadFile}>
                Upload File
            </button>
        </div>
    );
};

const InputOptions: React.FC = () => {
    const [mode, setMode] = useState<'demo' | 'actual'>('demo');

    return (
        <div style={styles.container}>
            <div style={styles.modeSelector}>
                <button
                    style={{
                        ...styles.modeButton,
                        backgroundColor: mode === 'demo' ? '#4caf50' : '#ccc',
                    }}
                    onClick={() => setMode('demo')}
                >
                    Demo Trial
                </button>
                <button
                    style={{
                        ...styles.modeButton,
                        backgroundColor: mode === 'actual' ? '#4caf50' : '#ccc',
                    }}
                    onClick={() => setMode('actual')}
                >
                    Actual Analysis
                </button>
            </div>

            {mode === 'demo' ? (
                <div style={styles.demoContainer}>
                    <h2 style={styles.title}>Live Stream Demo</h2>
                    <p style={styles.description}>
                        Try out our live streaming feature with the ability to capture images in real-time.
                    </p>
                    <VideoStreamCapture />
                </div>
            ) : (
                <div style={styles.actualContainer}>
                    <h2 style={styles.title}>Image Analysis</h2>
                    <p style={styles.description}>
                        Upload images for detailed analysis through our REST API.
                    </p>
                    <FileUpload />
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: '#0a0a0a',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        minHeight: '100vh',
        color: '#ffffff',
        background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.25), transparent 40%), radial-gradient(circle at bottom left, rgba(236, 72, 153, 0.25), transparent 40%), radial-gradient(circle at top left, rgba(59, 130, 246, 0.25), transparent 30%), radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.25), transparent 30%)',
    },
    card: {
        background: 'radial-gradient(circle at 30% 20%, rgba(60, 60, 60, 0.9), rgba(20, 20, 20, 0.95)), radial-gradient(circle at 70% 80%, rgba(50, 50, 50, 0.9), rgba(15, 15, 15, 0.95)), linear-gradient(45deg, rgba(40, 40, 40, 0.8), rgba(30, 30, 30, 0.9))',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        marginBottom: '20px',
        textAlign: 'center' as const,
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(8px)',
        position: 'relative' as const,
        '::before': {
            content: '""',
            position: 'absolute' as const,
            top: '-10px',
            left: '-10px',
            right: '-10px',
            bottom: '-10px',
            borderRadius: '20px',
            border: '2px dashed rgba(99, 102, 241, 0.3)',
            pointerEvents: 'none' as const,
        },
    },
    title: {
        fontSize: '28px',
        fontWeight: '700',
        marginBottom: '16px',
        color: '#ffffff',
        background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-0.5px',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    subtitle: {
        fontSize: '18px',
        color: '#a1a1aa',
        fontWeight: '500',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    video: {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) scaleX(-1)',
        width: '100%',
        height: '100%',
        objectFit: 'cover' as const,
        borderRadius: '12px',
    },
    buttonGroup: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
        marginTop: '20px',
    },
    button: {
        padding: '12px 24px',
        backgroundColor: '#6366f1',
        color: '#ffffff',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 6px rgba(99, 102, 241, 0.2)',
        marginLeft: '20px',
        ':hover': {
            backgroundColor: '#4f46e5',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 8px rgba(99, 102, 241, 0.3)',
        },
    },
    buttonSecondary: {
        padding: '12px 24px',
        backgroundColor: 'transparent',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        ':hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            transform: 'translateY(-2px)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
        },
    },
    streamContainer: {
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px',
        background: 'radial-gradient(circle at 30% 20%, rgba(60, 60, 60, 0.9), rgba(20, 20, 20, 0.95)), radial-gradient(circle at 70% 80%, rgba(50, 50, 50, 0.9), rgba(15, 15, 15, 0.95)), linear-gradient(45deg, rgba(40, 40, 40, 0.8), rgba(30, 30, 30, 0.9))',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(8px)',
        position: 'relative' as const,
        '::before': {
            content: '""',
            position: 'absolute' as const,
            top: '-10px',
            left: '-10px',
            right: '-10px',
            bottom: '-10px',
            borderRadius: '20px',
            border: '2px dashed rgba(99, 102, 241, 0.3)',
            pointerEvents: 'none' as const,
        },
    },
    videoWrapper: {
        position: 'relative' as const,
        width: '100%',
        height: '450px',
        backgroundColor: '#000',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
    },
    controls: {
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
        marginBottom: '24px',
    },
    controlButton: {
        padding: '12px 24px',
        backgroundColor: '#6366f1',
        color: '#ffffff',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 6px rgba(99, 102, 241, 0.2)',
        ':hover': {
            backgroundColor: '#4f46e5',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 8px rgba(99, 102, 241, 0.3)',
        },
    },
    errorMessage: {
        color: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: '16px',
        borderRadius: '12px',
        marginBottom: '24px',
        textAlign: 'center' as const,
        border: '1px solid rgba(239, 68, 68, 0.2)',
        fontWeight: '500',
    },
    gallery: {
        marginTop: '32px',
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.8), rgba(17, 17, 17, 0.9))',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(8px)',
    },
    galleryTitle: {
        fontSize: '24px',
        color: '#ffffff',
        marginBottom: '20px',
        fontWeight: '700',
        background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    imageGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
    },
    imageWrapper: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: '12px',
    },
    capturedImage: {
        width: '100%',
        height: '200px',
        objectFit: 'cover' as const,
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'transform 0.3s ease, filter 0.3s ease',
        filter: 'grayscale(100%)',
        ':hover': {
            transform: 'scale(1.02)',
            filter: 'grayscale(0%)',
        },
    },
    imageLabel: {
        fontSize: '14px',
        color: '#a1a1aa',
        fontWeight: '500',
    },
    modeSelector: {
        display: 'flex',
        gap: '16px',
        marginBottom: '32px',
    },
    modeButton: {
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: '600',
        color: '#ffffff',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        ':hover': {
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3))',
            transform: 'translateY(-2px)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
        },
    },
    demoContainer: {
        width: '100%',
        maxWidth: '800px',
        textAlign: 'center' as const,
    },
    actualContainer: {
        width: '100%',
        maxWidth: '800px',
        textAlign: 'center' as const,
    },
    description: {
        fontSize: '16px',
        color: '#a1a1aa',
        marginBottom: '24px',
        lineHeight: '1.6',
        fontWeight: '500',
    },
    fileInput: {
        marginBottom: '16px',
        padding: '12px',
        borderRadius: '12px',
        border: '2px dashed rgba(99, 102, 241, 0.3)',
        backgroundColor: 'rgba(17, 17, 17, 0.7)',
        color: '#ffffff',
        width: '100%',
        maxWidth: '400px',
        cursor: 'pointer',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.3s ease',
        ':hover': {
            borderColor: 'rgba(99, 102, 241, 0.5)',
            backgroundColor: 'rgba(26, 26, 26, 0.8)',
        },
        ':focus': {
            outline: 'none',
            borderColor: '#6366f1',
            boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.2)',
        },
    },
    previewContainer: {
        margin: '20px 0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewImage: {
        maxWidth: '100%',
        maxHeight: '300px',
        objectFit: 'contain' as const,
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        filter: 'grayscale(100%)',
        transition: 'transform 0.3s ease, filter 0.3s ease',
        ':hover': {
            transform: 'scale(1.02)',
            filter: 'grayscale(0%)',
        },
    },
};

export default InputOptions;
