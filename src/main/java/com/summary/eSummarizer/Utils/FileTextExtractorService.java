package com.summary.eSummarizer.Utils;

import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.sax.BodyContentHandler;
import org.springframework.stereotype.Service;
import org.xml.sax.SAXException;
import org.apache.tika.exception.TikaException;

import java.io.IOException;
import java.io.InputStream;

@Service
public class FileTextExtractorService {
    public String extractText(InputStream inputStream) throws IOException, TikaException, SAXException {
        BodyContentHandler handler = new BodyContentHandler(-1); // -1 = unlimited size
        Metadata metadata = new Metadata();
        AutoDetectParser parser = new AutoDetectParser();

        parser.parse(inputStream, handler, metadata);
        return handler.toString();
    }
}
