package com.summary.eSummarizer.Controller;

import com.summary.eSummarizer.DTO.SummaryInfo;
import com.summary.eSummarizer.Summarizer.TextRankSummarizer;
import com.summary.eSummarizer.Utils.FileTextExtractorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/api/summarize")
public class FileUploadController {

    @Autowired
    private FileTextExtractorService fileTextExtractorService;

    @Autowired
    private TextRankSummarizer textRankSummarizer;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file was Provided!");
        }
        try {
            String extractedText = fileTextExtractorService.extractText(file.getInputStream());
            SummaryInfo summary = textRankSummarizer.summarize(extractedText);
            return ResponseEntity.ok(summary);
        } catch (Exception er) {
            return ResponseEntity.status(500).body("error: " + er.getMessage());
        }
    }
}


