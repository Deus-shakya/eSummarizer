package com.summary.eSummarizer.DTO;

public class SummarizationRequest {
    private String text;
    private Integer max_length;
    private Integer min_length;

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public Integer getMax_length() { return max_length; }
    public void setMax_length(Integer max_length) { this.max_length = max_length; }
    public Integer getMin_length() { return min_length; }
    public void setMin_length(Integer min_length) { this.min_length = min_length; }
}