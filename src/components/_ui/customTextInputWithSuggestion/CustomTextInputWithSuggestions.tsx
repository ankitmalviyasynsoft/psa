import React, { useState } from 'react'
import { TextField, Popper, Paper, List, ListItem, ListItemText } from '@mui/material'

interface CustomTextInputWithSuggestionsProps {
  value: string
  onChange: (value: string) => void
  onSuggestionSelect: (suggestion: { title: string; declaredValue: number }) => void
  suggestions: Array<{ title: string; declaredValue: number }>
  placeholder?: string
}

const CustomTextInputWithSuggestions: React.FC<CustomTextInputWithSuggestionsProps> = ({ value, onChange, onSuggestionSelect, suggestions, placeholder }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleBlur = () => {
    setTimeout(() => {
      setAnchorEl(null)
    }, 100)
  }

  return (
    <div>
      <TextField fullWidth value={value} onChange={(e) => onChange(e.target.value)} onFocus={handleFocus} onBlur={handleBlur} placeholder={placeholder} />
      <Popper open={Boolean(anchorEl) && suggestions.length > 0} anchorEl={anchorEl} placement="bottom-start">
        <Paper>
          <List>
            {suggestions.map((suggestion, index) => (
              <ListItem sx={{ cursor: 'pointer' }} key={index} component="li" onClick={() => onSuggestionSelect(suggestion)}>
                <ListItemText primary={suggestion.title} secondary={`$${suggestion.declaredValue}`} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Popper>
    </div>
  )
}

export default CustomTextInputWithSuggestions
