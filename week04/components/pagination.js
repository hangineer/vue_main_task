export default{
    props:['pagination','getData'],
    template:
    `<nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :class = "{ disabled : !pagination.has_pre }">
          <a @click.prevent="getData(pagination.current_page - 1)" class="page-link" href="#">&laquo;</a>
        </li>

        <li class="page-item" :class= "{ active: pagination.current_page === page}" v-for="page in pagination.total_pages" :key="page + 'unique'">
          <a href="#" @click.prevent="getData(page)" class="page-link">{{ page }}</a>
        </li>

        <li class="page-item" :class = "{ disabled : !pagination.has_next }">
          <a @click.prevent="getData(pagination.current_page + 1)" class="page-link" href="#">&raquo;</a>
        </li>
      </ul>
    </nav>`
}