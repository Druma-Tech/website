import React, { useRef, useState } from 'react';

const VideoStreamCapture: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImages, setCapturedImages] = useState<string[]>([]);
    const [recordedVideos, setRecordedVideos] = useState<string[]>([]);
    const [isRecording, setIsRecording] = useState(false);

    const startStream = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };

    const stopStream = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
    };

    const captureFrame = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

            const blob = await new Promise<Blob | null>((resolve) =>
                canvas.toBlob(resolve, 'image/jpeg')
            );

            if (blob) {
                const imgURL = URL.createObjectURL(blob);
                setCapturedImages((prevImages) => [...prevImages, imgURL]);
            }
        }
    };

    const startRecording = () => {
        if (stream) {
            const mediaRecorder = new MediaRecorder(stream);
            const chunks: Blob[] = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const videoBlob = new Blob(chunks, { type: 'video/mp4' });
                const videoURL = URL.createObjectURL(videoBlob);
                setRecordedVideos((prevVideos) => [...prevVideos, videoURL]);
            };

            mediaRecorder.start();
            mediaRecorderRef.current = mediaRecorder;
            setIsRecording(true);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const clearFrames = () => {
        setCapturedImages([]);
    };

    const clearVideos = () => {
        setRecordedVideos([]);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Video Stream Capture</h1>
            <div style={styles.card}>
                <video
                    ref={videoRef}
                    autoPlay
                    style={styles.video}
                >
                    <track kind="captions" />
                </video>
                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                <div style={styles.buttonGroup}>
                    <button style={styles.button} onClick={startStream}>
                        Start Stream
                    </button>
                    <button style={styles.button} onClick={stopStream}>
                        Stop Stream
                    </button>
                    <button style={styles.button} onClick={captureFrame}>
                        Capture Frame
                    </button>
                    {isRecording ? (
                        <button style={styles.buttonSecondary} onClick={stopRecording}>
                            Stop Recording
                        </button>
                    ) : (
                        <button style={styles.button} onClick={startRecording}>
                            Record Video
                        </button>
                    )}
                    <button style={styles.buttonSecondary} onClick={clearFrames}>
                        Clear Frames
                    </button>
                    <button style={styles.buttonSecondary} onClick={clearVideos}>
                        Clear Videos
                    </button>
                </div>
            </div>

            {capturedImages.length > 0 && (
                <div style={styles.mediaContainer}>
                    <h2 style={styles.subtitle}>Captured Frames</h2>
                    <div style={styles.mediaRow}>
                        {capturedImages.map((image, index) => (
                            <div key={image} style={styles.mediaWrapper}>
                                <img
                                    src={image}
                                    alt={`Captured Frame ${index + 1}`}
                                    style={styles.mediaItem}
                                />
                                <p style={styles.mediaLabel}>Frame {index + 1}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {recordedVideos.length > 0 && (
                <div style={styles.mediaContainer}>
                    <h2 style={styles.subtitle}>Recorded Videos</h2>
                    <div style={styles.mediaRow}>
                        {recordedVideos.map((video, index) => (
                            <div key={video} style={styles.mediaWrapper}>
                                <video
                                    controls
                                    src={video}
                                    style={styles.mediaItem}
                                />
                                <p style={styles.mediaLabel}>Video {index + 1}</p>
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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
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
            <button style={styles.button} onClick={uploadFile}>
                Upload File
            </button>
        </div>
    );
};

const InputOptions: React.FC = () => {
    const [inputMode, setInputMode] = useState<'file' | 'stream'>('file');

    return (
        <div style={styles.container}>
            <div style={styles.switchButtons}>
                <button
                    style={{
                        ...styles.switchButton,
                        backgroundColor: inputMode === 'file' ? '#4caf50' : '#ccc',
                    }}
                    onClick={() => setInputMode('file')}
                >
                    Upload File
                </button>
                <button
                    style={{
                        ...styles.switchButton,
                        backgroundColor: inputMode === 'stream' ? '#4caf50' : '#ccc',
                    }}
                    onClick={() => setInputMode('stream')}
                >
                    Live Stream
                </button>
            </div>
            {inputMode === 'file' ? <FileUpload /> : <VideoStreamCapture />}
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
        backgroundColor: '#f9f9f9',
        fontFamily: 'Arial, sans-serif',
        minHeight: '100vh',
    },
    card: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
        textAlign: 'center' as const,
    },
    title: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#333',
    },
    subtitle: {
        fontSize: '18px',
        color: '#555',
    },
    video: {
        width: '100%',
        borderRadius: '10px',
        marginTop: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    buttonGroup: {
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        marginTop: '15px',
    },
    button: {
        padding: '10px 15px',
        backgroundColor: '#4caf50',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    buttonSecondary: {
        padding: '10px 15px',
        backgroundColor: '#f44336',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    mediaContainer: {
        marginTop: '20px',
        textAlign: 'center' as const,
    },
    imageContainer: {
        marginTop: '20px',
        textAlign: 'center' as const,
    },
    imageGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '10px',
    },
    imageWrapper: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
    },
    mediaWrapper: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
    },
    mediaRow: {
        display: 'flex',
        flexWrap: 'wrap' as const,
        justifyContent: 'center',
        gap: '10px',
    },
    imageRow: {
        display: 'flex',
        flexWrap: 'wrap' as const,
        justifyContent: 'center',
        gap: '10px',
    },
    image: {
        width: '300px',
        borderRadius: '10px',
        marginTop: '10px',
    },
    fileInput: {
        marginBottom: '10px',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    mediaItem: {
        width: '300px',
        borderRadius: '10px',
        marginTop: '10px',
    },
    mediaLabel: {
        fontSize: '14px',
        color: '#333',
        marginTop: '5px',
    },
    imageLabel: {
        fontSize: '14px',
        color: '#333',
        marginTop: '5px',
    },
    switchButtons: {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
    },
    switchButton: {
        padding: '10px 20px',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default InputOptions;
