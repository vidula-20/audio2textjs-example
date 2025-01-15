import fs from 'fs';
import Audio2TextJS from 'audio2textjs';

// Example usage
const converter = new Audio2TextJS({
    threads: 4,
    processors: 1,
    outputJson: true, // Ensure this is true to get JSON output
});

const inputFile = 'C:\\Users\\user\\Desktop\\audio to text\\jackhammer.wav';
const model = 'tiny'; // Specify one of the available models
const language = 'english'; // or specify a language code for translation

// Run the whisper conversion
converter.runWhisper(inputFile, model, language)
    .then(result => {
        // Check if the result contains the expected output file
        if (result && result.success && result.output && result.output[0].outputFile) {
            const outputFile = result.output[0].outputFile;
            
            // Read the output JSON file containing transcription data
            fs.readFile(outputFile, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading output JSON file:', err);
                    return;
                }

                try {
                    const parsedData = JSON.parse(data);
                    if (parsedData.transcription) {
                        // Extract and combine all transcription text
                        const transcriptionText = parsedData.transcription.map(entry => entry.text).join(' ');

                        // Convert the transcription text to Base64
                        const base64Data = Buffer.from(transcriptionText).toString('base64');
                        console.log('Base64 Transcription Text:', base64Data);  // Output the Base64 encoded text

                        // Now convert the Base64 back to the original text message
                        const decodedText = Buffer.from(base64Data, 'base64').toString('utf8');
                        console.log('Decoded Transcription Text:', decodedText);  // Output the decoded transcription text
                    } else {
                        console.error('No transcription data found in output JSON.');
                    }
                } catch (parseError) {
                    console.error('Error parsing output JSON file:', parseError);
                }
            });
        } else {
            console.error('No output file found.');
        }
    })
    .catch(error => {
        console.error('Error during conversion:', error);
    }); 