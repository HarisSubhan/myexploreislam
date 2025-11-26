// If you don't want the entire row to be clickable, remove the click handlers:
{filteredVideos.length > 0 ? (
  filteredVideos.map((item) => (
    <tr key={item.id}>
      <td>
        <Form.Check
          type="checkbox"
          checked={item.checked || false}
          onChange={() => handleCheckboxChange(item.id)}
        />
      </td>
      <td>
        <span className={`badge ${
          series.some(s => s.id === item.id) ? 'bg-warning' : 'bg-info'
        }`}>
          {series.some(s => s.id === item.id) ? 'Series' : 'Single'}
        </span>
      </td>
      <td>{item.title || item.name || item.video}</td>
      <td>{item.age || item.recommendedAge || 'N/A'}</td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="4" className="text-center">
      No videos found
    </td>
  </tr>
)}