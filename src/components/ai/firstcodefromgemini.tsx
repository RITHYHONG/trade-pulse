<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gemini Trading Analyzer</title>
    <!-- Load Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Use Inter font -->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
        body {
            font-family: 'Inter', sans-serif;
            background-color: #0d1117; /* Dark, professional background */
            color: #e5e7eb;
        }

        /* Custom CSS for the Staggered Chevron Pulse Animation */
        .chevron-container {
            width: 100px;
            height: 100px;
            transform: scale(0.8);
        }
        @keyframes pulse-up-inner {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(-30px); opacity: 0; }
        }
        @keyframes pulse-up-middle {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(-30px); opacity: 0; }
        }
        @keyframes pulse-up-outer {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(-30px); opacity: 0; }
        }
        #inner-chevron { animation: pulse-up-inner 1.2s infinite linear; animation-delay: 0.0s; }
        #middle-chevron { animation: pulse-up-middle 1.2s infinite linear; animation-delay: 0.4s; }
        #outer-chevron { animation: pulse-up-outer 1.2s infinite linear; animation-delay: 0.8s; }

        /* Custom scrollbar for dark theme */
        .results-box::-webkit-scrollbar { width: 8px; }
        .results-box::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 4px; }
        .results-box::-webkit-scrollbar-track { background: #0d1117; }
    </style>
</head>
<body>

    <div class="min-h-screen flex flex-col items-center justify-start py-12 p-4">
        <h1 class="text-4xl font-extrabold mb-8 text-green-400">
            Gemini Market Momentum Analyzer
        </h1>

        <!-- Input and Control Panel -->
        <div class="w-full max-w-2xl bg-[#161b22] p-6 rounded-xl shadow-2xl mb-8 border border-gray-700">
            <div class="flex flex-col sm:flex-row gap-4">
                <input 
                    type="text" 
                    id="ticker-input" 
                    placeholder="Enter Stock Ticker (e.g., GOOG, AAPL, TSLA)"
                    class="flex-grow p-3 rounded-lg bg-[#0d1117] text-gray-300 border border-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition duration-200"
                />
                <button 
                    onclick="analyzeMarket()" 
                    id="analyze-button"
                    class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 shadow-md flex items-center justify-center disabled:opacity-50"
                >
                    <span class="mr-2">✨</span> Analyze Market Outlook
                </button>
            </div>
            <div class="mt-4 flex gap-4">
                <button 
                    onclick="readSummary()" 
                    id="tts-button"
                    disabled
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 shadow-md flex items-center justify-center disabled:opacity-50"
                >
                    <span class="mr-2">🔊</span> Read Summary Aloud
                </button>
            </div>
        </div>

        <!-- Loading Indicator (Chevron Animation) -->
        <div id="loader" class="flex flex-col items-center space-y-4" style="display: none;">
            <div class="chevron-container">
                <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="text-green-500 w-full h-full">
                    <g id="outer-chevron" class="transform origin-center"><path d="M 10 50 L 50 10 L 90 50" stroke-width="8" /></g>
                    <g id="middle-chevron" class="transform origin-center"><path d="M 20 65 L 50 35 L 80 65" stroke-width="8" /></g>
                    <g id="inner-chevron" class="transform origin-center"><path d="M 30 80 L 50 60 L 70 80" stroke-width="8" /></g>
                </svg>
            </div>
            <div class="text-xl font-semibold text-gray-300 tracking-wider animate-pulse">
                Analyzing Market Data...
            </div>
        </div>

        <!-- Results Area -->
        <div id="results-container" class="w-full max-w-4xl bg-[#161b22] p-8 rounded-xl shadow-2xl border border-gray-700 mt-6" style="display: none;">
            <h2 class="text-2xl font-bold mb-4 text-green-400" id="results-title"></h2>
            <div id="summary-text" class="results-box text-gray-200 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto"></div>
            <div id="citation-sources" class="mt-4 text-sm text-gray-500 border-t border-gray-700 pt-4"></div>
        </div>
        
        <!-- Custom Alert Box (Replaces alert()) -->
        <div id="custom-alert" class="fixed top-5 right-5 bg-red-800 p-4 rounded-lg shadow-xl text-white font-semibold transition-opacity duration-300" style="display: none;"></div>
        
    </div>

    <script>
        // --- GEMINI API Setup ---
        const apiKey = "";
        const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/";
        const model = "gemini-2.5-flash-preview-09-2025";
        const ttsModel = "gemini-2.5-flash-preview-tts";

        // --- DOM Elements ---
        const loader = document.getElementById('loader');
        const resultsContainer = document.getElementById('results-container');
        const summaryText = document.getElementById('summary-text');
        const resultsTitle = document.getElementById('results-title');
        const citationSources = document.getElementById('citation-sources');
        const tickerInput = document.getElementById('ticker-input');
        const analyzeButton = document.getElementById('analyze-button');
        const ttsButton = document.getElementById('tts-button');

        // --- Utility Functions ---

        function showAlert(message, type = 'error') {
            const alertBox = document.getElementById('custom-alert');
            alertBox.textContent = message;
            alertBox.className = `fixed top-5 right-5 p-4 rounded-lg shadow-xl text-white font-semibold transition-opacity duration-300 ${type === 'error' ? 'bg-red-800' : 'bg-green-800'}`;
            alertBox.style.display = 'block';
            setTimeout(() => {
                alertBox.style.display = 'none';
            }, 5000);
        }

        async function exponentialBackoffFetch(url, options, maxRetries = 5) {
            for (let i = 0; i < maxRetries; i++) {
                try {
                    const response = await fetch(url, options);
                    if (response.ok) {
                        return response;
                    } else if (response.status === 429 && i < maxRetries - 1) {
                        // Rate limit error, wait and retry
                        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
                        await new Promise(resolve => setTimeout(resolve, delay));
                        // Continue to the next loop iteration (retry)
                    } else {
                        // Other errors, throw them
                        const errorData = await response.json();
                        throw new Error(`API Error ${response.status}: ${JSON.stringify(errorData)}`);
                    }
                } catch (error) {
                    if (i === maxRetries - 1) {
                        throw error;
                    }
                    // Wait and retry for network errors
                    const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
            throw new Error("Exceeded maximum retries.");
        }

        // --- Core Gemini LLM Function (Text Generation with Grounding) ---

        async function analyzeMarket() {
            const ticker = tickerInput.value.trim().toUpperCase();
            if (!ticker) {
                showAlert("Please enter a stock ticker or company name.");
                return;
            }

            // Reset UI and show loader
            summaryText.innerHTML = '';
            citationSources.innerHTML = '';
            resultsContainer.style.display = 'none';
            loader.style.display = 'flex';
            analyzeButton.disabled = true;
            ttsButton.disabled = true;

            const url = `${BASE_URL}${model}:generateContent?key=${apiKey}`;

            const systemPrompt = `You are a world-class financial market analyst. Provide a concise, three-paragraph summary of the requested company's latest quarterly performance, recent stock movements, and general market outlook. Use professional but clear language.`;
            const userQuery = `Find the latest and most relevant financial information and stock analysis for ${ticker}.`;

            const payload = {
                contents: [{ parts: [{ text: userQuery }] }],
                // Enable Google Search grounding for real-time market data
                tools: [{ "google_search": {} }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
            };

            try {
                const response = await exponentialBackoffFetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();
                const candidate = result.candidates?.[0];
                
                if (!candidate || !candidate.content?.parts?.[0]?.text) {
                    throw new Error("No analysis content received from the API.");
                }

                // 1. Extract the generated text
                const text = candidate.content.parts[0].text;

                // 2. Extract grounding sources
                let sourcesHtml = '<strong>Sources:</strong>';
                const groundingMetadata = candidate.groundingMetadata;
                if (groundingMetadata && groundingMetadata.groundingAttributions) {
                    const sources = groundingMetadata.groundingAttributions
                        .map(attribution => ({
                            uri: attribution.web?.uri,
                            title: attribution.web?.title,
                        }))
                        .filter(source => source.uri && source.title);

                    if (sources.length > 0) {
                        sourcesHtml += '<ul class="mt-2 space-y-1 list-disc pl-5">';
                        sources.forEach(source => {
                            sourcesHtml += `<li><a href="${source.uri}" target="_blank" class="text-blue-400 hover:text-blue-300 transition">${source.title}</a></li>`;
                        });
                        sourcesHtml += '</ul>';
                    } else {
                        sourcesHtml += ' No real-time sources were cited for this summary.';
                    }
                } else {
                    sourcesHtml += ' No real-time sources were cited for this summary.';
                }
                
                // Update UI
                resultsTitle.textContent = `Market Outlook for ${ticker}`;
                summaryText.textContent = text;
                citationSources.innerHTML = sourcesHtml;
                resultsContainer.style.display = 'block';
                ttsButton.disabled = false; // Enable TTS after successful generation

            } catch (error) {
                console.error("Analysis failed:", error);
                showAlert(`Failed to analyze market for ${ticker}. Check the console for details.`);
            } finally {
                // Hide loader and re-enable button
                loader.style.display = 'none';
                analyzeButton.disabled = false;
            }
        }


        // --- Audio/WAV Utility Functions for TTS ---

        function base64ToArrayBuffer(base64) {
            const binaryString = atob(base64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
        }

        function pcmToWav(pcm16, sampleRate) {
            const numChannels = 1;
            const bytesPerSample = 2; // 16-bit PCM
            const dataLength = pcm16.length * bytesPerSample;
            const buffer = new ArrayBuffer(44 + dataLength);
            const view = new DataView(buffer);

            // RIFF header
            writeString(view, 0, 'RIFF');
            view.setUint32(4, 36 + dataLength, true);
            writeString(view, 8, 'WAVE');
            
            // FMT sub-chunk
            writeString(view, 12, 'fmt ');
            view.setUint32(16, 16, true);          // Sub-chunk size
            view.setUint16(20, 1, true);           // Audio format (1 for PCM)
            view.setUint16(22, numChannels, true); // Number of channels
            view.setUint32(24, sampleRate, true);  // Sample rate
            view.setUint32(28, sampleRate * numChannels * bytesPerSample, true); // Byte rate
            view.setUint16(32, numChannels * bytesPerSample, true);             // Block align
            view.setUint16(34, bytesPerSample * 8, true);                       // Bits per sample (16)
            
            // DATA sub-chunk
            writeString(view, 36, 'data');
            view.setUint32(40, dataLength, true); // Data size

            // Write PCM data
            let offset = 44;
            for (let i = 0; i < pcm16.length; i++) {
                view.setInt16(offset, pcm16[i], true);
                offset += bytesPerSample;
            }

            return new Blob([buffer], { type: 'audio/wav' });

            function writeString(view, offset, string) {
                for (let i = 0; i < string.length; i++) {
                    view.setUint8(offset + i, string.charCodeAt(i));
                }
            }
        }

        function playAudio(audioBlob) {
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play().catch(e => console.error("Error playing audio:", e));

            // Change button state while playing
            audio.onplaying = () => { ttsButton.textContent = '⏸️ Playing...'; ttsButton.disabled = true; };
            audio.onended = () => { ttsButton.textContent = '🔊 Read Summary Aloud'; ttsButton.disabled = false; };
            audio.onerror = () => { 
                ttsButton.textContent = '🔊 Read Summary Aloud'; 
                ttsButton.disabled = false;
                showAlert('Failed to play audio. The TTS content may be too complex.');
            };
        }

        // --- Core Gemini TTS Function (Audio Generation) ---

        async function readSummary() {
            const textToSpeak = summaryText.textContent;
            if (!textToSpeak) {
                showAlert("Generate a summary first before reading aloud.");
                return;
            }
            
            ttsButton.textContent = '⏳ Generating Audio...';
            ttsButton.disabled = true;

            const url = `${BASE_URL}${ttsModel}:generateContent?key=${apiKey}`;

            // We use the "Charon" voice for an informative, firm tone suitable for finance
            const payload = {
                contents: [{ parts: [{ text: `Read the following financial summary: ${textToSpeak}` }] }],
                generationConfig: {
                    responseModalities: ["AUDIO"],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: "Charon" }
                        }
                    }
                },
            };

            try {
                const response = await exponentialBackoffFetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                const result = await response.json();
                const part = result?.candidates?.[0]?.content?.parts?.[0];
                const audioData = part?.inlineData?.data;
                const mimeType = part?.inlineData?.mimeType;

                if (!audioData || !mimeType || !mimeType.startsWith("audio/L16")) {
                     throw new Error("Invalid TTS audio data received.");
                }
                
                // Extract sample rate (e.g., from audio/L16; rate=24000)
                const rateMatch = mimeType.match(/rate=(\d+)/);
                const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000; 

                // API returns signed PCM16 audio data
                const pcmData = base64ToArrayBuffer(audioData);
                const pcm16 = new Int16Array(pcmData);
                
                const wavBlob = pcmToWav(pcm16, sampleRate);
                playAudio(wavBlob);
                
            } catch (error) {
                console.error("TTS failed:", error);
                showAlert("Failed to generate audio summary. Please try again.");
                ttsButton.textContent = '🔊 Read Summary Aloud';
                ttsButton.disabled = false;
            }
        }
        
    </script>

</body>
</html>